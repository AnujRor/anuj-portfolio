// Mirrors your GitHub repos (private ones too) into the `projects` table:
// new repo -> new project, edited repo/README -> updated project, deleted repo -> project removed.
// Runs every minute from pg_cron (supabase/github-sync.sql) and from the admin "Sync now" button.
// Secrets: GITHUB_TOKEN (fine-grained token, read-only Metadata + Contents on all repos).
// Optional: PORTFOLIO_REPO (this website's repo, never listed as a project; default "anuj-portfolio"),
// SERVICE_KEY (a Supabase secret key, only needed if the project has the legacy service_role key turned off).
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { type Repo, githubFields, isShown, newRowDefaults, normalize, parseReadme } from './core.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

// Row value vs GitHub value: the push time is compared as an instant (Postgres and GitHub format it differently),
// everything else by content
const same = (key: string, a: unknown, b: unknown) =>
  key === 'github_pushed_at' ? Date.parse(String(a)) === Date.parse(String(b)) : JSON.stringify(a ?? null) === JSON.stringify(b ?? null)

// Anyone can trigger a sync (it only copies GitHub data in), so calls are throttled instead of authenticated
const MIN_GAP_MS = 20_000

const token = Deno.env.get('GITHUB_TOKEN')
const portfolioRepo = Deno.env.get('PORTFOLIO_REPO') || 'anuj-portfolio'
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_KEY')!, { auth: { persistSession: false } })

async function gh(path: string, accept = 'application/vnd.github+json') {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: accept, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'anuj-portfolio-sync' },
  })
  return res
}

async function listRepos(): Promise<Repo[]> {
  const repos: Repo[] = []
  for (let page = 1; ; page++) {
    const res = await gh(`/user/repos?affiliation=owner&per_page=100&page=${page}`)
    // Any failure aborts the whole run: a bad token must never look like "all repos were deleted"
    if (!res.ok) throw new Error(`GitHub /user/repos ${res.status}: ${(await res.text()).slice(0, 200)}`)
    const batch = (await res.json()) as Repo[]
    repos.push(...batch)
    if (batch.length < 100) return repos
  }
}

async function readme(repo: Repo) {
  const res = await gh(`/repos/${repo.full_name}/readme`, 'application/vnd.github.raw')
  if (res.status === 404) return { about: '', features: [] }
  if (!res.ok) throw new Error(`GitHub readme ${repo.name} ${res.status}`)
  return parseReadme(await res.text())
}

async function sync() {
  const all = await listRepos()
  const repos = all.filter((r) => isShown(r, portfolioRepo))

  const { data: rows, error } = await db.from('projects').select('*')
  if (error) throw error

  const byGithubId = new Map(rows.filter((r) => r.github_id).map((r) => [Number(r.github_id), r]))
  const unlinked = rows.filter((r) => !r.github_id)
  let nextTop = Math.min(0, ...rows.map((r) => r.sort_order)) - 1
  const result = { repos: repos.length, added: [] as string[], updated: [] as string[], removed: [] as string[] }

  for (const repo of repos) {
    // Existing link, else a manual project with the same repo name / title (first sync of the old projects)
    let row = byGithubId.get(repo.id)
    if (!row) {
      row = unlinked.find((r) => (r.github_name && r.github_name.toLowerCase() === repo.name.toLowerCase()) || normalize(r.title) === normalize(repo.name))
      if (row) unlinked.splice(unlinked.indexOf(row), 1)
    }

    // README only when there are new commits (saves API calls); metadata is compared every run
    const changedCode = !row || !row.github_pushed_at || new Date(row.github_pushed_at).getTime() !== new Date(repo.pushed_at).getTime() || !row.github_id
    const fields = githubFields(repo, changedCode ? await readme(repo) : null)

    if (!row) {
      const { error } = await db.from('projects').insert({ ...newRowDefaults(repo), ...fields, sort_order: nextTop-- })
      if (error) throw error
      result.added.push(repo.name)
    } else {
      // Only write when something differs, so an unchanged repo doesn't bump updated_at every minute
      const changed = Object.fromEntries(Object.entries(fields).filter(([k, v]) => !same(k, row[k], v)))
      if (Object.keys(changed).length) {
        const { error } = await db.from('projects').update(changed).eq('id', row.id)
        if (error) throw error
        result.updated.push(repo.name)
      }
    }
  }

  // Repos that were deleted, forked-only, or tagged hide-from-portfolio (a rename keeps the id, so it just updates the title)
  const keep = new Set(repos.map((r) => r.id))
  const gone = rows.filter((r) => r.github_id && !keep.has(Number(r.github_id)))
  if (gone.length) {
    const { error } = await db.from('projects').delete().in('id', gone.map((r) => r.id))
    if (error) throw error
    result.removed = gone.map((r) => r.github_name || r.title)
  }
  return result
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (!token) return json({ error: 'GITHUB_TOKEN secret is not set' }, 500)

  const { data: state } = await db.from('github_sync_state').select('last_run').eq('id', 1).maybeSingle()
  if (state?.last_run && Date.now() - new Date(state.last_run).getTime() < MIN_GAP_MS) return json({ skipped: 'synced a few seconds ago' })
  await db.from('github_sync_state').upsert({ id: 1, last_run: new Date().toISOString() })

  try {
    const result = await sync()
    await db.from('github_sync_state').upsert({ id: 1, last_run: new Date().toISOString(), result })
    return json(result)
  } catch (err) {
    const result = { error: err instanceof Error ? err.message : String(err) }
    await db.from('github_sync_state').upsert({ id: 1, last_run: new Date().toISOString(), result })
    return json(result, 500)
  }
})
