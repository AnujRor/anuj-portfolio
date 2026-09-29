// Mirrors your GitHub repos (private ones too) into the `projects` and `posts` (blog) tables:
// new repo -> new project + blog post, edited repo/README -> both updated, deleted repo -> both removed.
// Runs every minute from pg_cron (supabase/github-sync.sql) and from the admin "Sync now" button.
// Secrets: GITHUB_TOKEN (fine-grained token, read-only Metadata + Contents on all repos).
// Optional: VERCEL_DEPLOY_HOOK (rebuilds the site after a change so SEO pages and the sitemap stay current),
// PORTFOLIO_REPO (this website's repo, never listed as a project; default "anuj-portfolio"),
// SERVICE_KEY (a Supabase secret key, only needed if the project has the legacy service_role key turned off).
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { type Repo, githubFields, isShown, newRowDefaults, normalize, parseReadme, postFields, slugify } from './core.ts'

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
const deployHook = Deno.env.get('VERCEL_DEPLOY_HOOK')
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

// Raw README markdown ('' when the repo has none)
async function readme(repo: Repo) {
  const res = await gh(`/repos/${repo.full_name}/readme`, 'application/vnd.github.raw')
  if (res.status === 404) return ''
  if (!res.ok) throw new Error(`GitHub readme ${repo.name} ${res.status}`)
  return await res.text()
}

// Insert, or update only the fields that differ (so an unchanged repo doesn't bump updated_at every minute)
async function upsert(table: string, row: Record<string, unknown> | undefined, fields: Record<string, unknown>, insertExtra: Record<string, unknown>) {
  if (!row) {
    const { error } = await db.from(table).insert({ ...insertExtra, ...fields })
    if (error) throw error
    return 'added'
  }
  const changed = Object.fromEntries(Object.entries(fields).filter(([k, v]) => !same(k, row[k], v)))
  if (!Object.keys(changed).length) return null
  const { error } = await db.from(table).update(changed).eq('id', row.id)
  if (error) throw error
  return 'updated'
}

async function sync() {
  const all = await listRepos()
  const repos = all.filter((r) => isShown(r, portfolioRepo))

  const [{ data: rows, error }, { data: posts, error: postsError }] = await Promise.all([db.from('projects').select('*'), db.from('posts').select('*')])
  if (error) throw error
  if (postsError) throw postsError

  const byGithubId = new Map(rows.filter((r) => r.github_id).map((r) => [Number(r.github_id), r]))
  const postByGithubId = new Map(posts.filter((p) => p.github_id).map((p) => [Number(p.github_id), p]))
  const slugs = new Set(posts.map((p) => p.slug))
  const unlinked = rows.filter((r) => !r.github_id)
  const unlinkedPosts = posts.filter((p) => !p.github_id)
  let nextTop = Math.min(0, ...rows.map((r) => r.sort_order)) - 1
  const result = { repos: repos.length, added: [] as string[], updated: [] as string[], removed: [] as string[] }

  for (const repo of repos) {
    // Existing link, else a manual project with the same repo name / title (first sync of the old projects)
    let row = byGithubId.get(repo.id)
    if (!row) {
      row = unlinked.find((r) => (r.github_name && r.github_name.toLowerCase() === repo.name.toLowerCase()) || normalize(r.title) === normalize(repo.name))
      if (row) unlinked.splice(unlinked.indexOf(row), 1)
    }
    let post = postByGithubId.get(repo.id)
    // A project that already had a hand-written blog post adopts it instead of getting a second one
    if (!post && row && normalize(row.title).length >= 3) {
      post = unlinkedPosts.find((p) => p.category === 'Projects' && normalize(p.title).includes(normalize(row.title)))
      if (post) unlinkedPosts.splice(unlinkedPosts.indexOf(post), 1)
    }

    // README only when there are new commits or something is new (saves API calls); metadata is compared every run
    const pushed = !row?.github_pushed_at || Date.parse(row.github_pushed_at) !== Date.parse(repo.pushed_at)
    const md = !row || !row.github_id || !post || pushed ? await readme(repo) : null

    const project = await upsert('projects', row, githubFields(repo, md != null ? parseReadme(md) : null), row ? {} : { ...newRowDefaults(repo), sort_order: nextTop-- })

    // Every project also gets a blog post. The cover follows the project's first screenshot set in admin.
    const cover = row?.images?.[0] || '/assets/portfolio-placeholder.svg'
    let slug = slugify(repo.name)
    if (!post && slugs.has(slug)) slug = `${slug}-project`
    slugs.add(slug)
    const { published: _keepAdminChoice, ...postUpdate } = postFields(repo, md, cover)
    // Hand-written posts (github_content = false) keep their text, cover and SEO; the sync only links them to the repo
    const blog = !post
      ? await upsert('posts', post, postFields(repo, md, cover), { slug })
      : post.github_content === false || !post.github_id
        ? await upsert('posts', post, { github_id: repo.id, github_content: false }, {})
        : await upsert('posts', post, postUpdate, {})

    if (project === 'added' || blog === 'added') result.added.push(repo.name)
    else if (project || blog) result.updated.push(repo.name)
  }

  // Repos that were deleted, forked-only, or tagged hide-from-portfolio (a rename keeps the id, so it just updates the title)
  const keep = new Set(repos.map((r) => r.id))
  const gone = rows.filter((r) => r.github_id && !keep.has(Number(r.github_id)))
  const gonePosts = posts.filter((p) => p.github_id && !keep.has(Number(p.github_id)))
  if (gone.length) {
    const { error } = await db.from('projects').delete().in('id', gone.map((r) => r.id))
    if (error) throw error
  }
  if (gonePosts.length) {
    const { error } = await db.from('posts').delete().in('id', gonePosts.map((p) => p.id))
    if (error) throw error
  }
  result.removed = [...new Set([...gone.map((r) => r.github_name || r.title), ...gonePosts.map((p) => p.title)])]
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
    // Something changed: rebuild the site so the sitemap, RSS and pre-rendered SEO pages include it
    const changed = result.added.length + result.updated.length + result.removed.length > 0
    if (changed && deployHook) await fetch(deployHook, { method: 'POST' }).catch(() => {})
    await db.from('github_sync_state').upsert({ id: 1, last_run: new Date().toISOString(), result: { ...result, redeployed: changed && !!deployHook } })
    return json(result)
  } catch (err) {
    const result = { error: err instanceof Error ? err.message : String(err) }
    await db.from('github_sync_state').upsert({ id: 1, last_run: new Date().toISOString(), result })
    return json(result, 500)
  }
})
