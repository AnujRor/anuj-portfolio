// ---------- Post body format ----------
// Stored as plain text: blank line = new block, "## " = heading, "> " = pull quote,
// a block whose lines all start with "- " = bullet list. No React here, so the build script can import it.

export function parseContent(text = '') {
  return text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      if (b.startsWith('## ')) return { h: b.slice(3).trim() }
      if (b.startsWith('> ')) return { quote: b.slice(2).trim() }
      const lines = b.split('\n').map((l) => l.trim())
      if (lines.every((l) => l.startsWith('- '))) return { list: lines.map((l) => l.slice(2).trim()) }
      return b
    })
}

export function blocksToText(blocks = []) {
  return blocks
    .map((b) => (typeof b === 'string' ? b : b.h ? `## ${b.h}` : b.quote ? `> ${b.quote}` : b.list ? b.list.map((i) => `- ${i}`).join('\n') : ''))
    .filter(Boolean)
    .join('\n\n')
}

// Plain text of a post (word counts, search)
export const blocksPlainText = (blocks = []) =>
  (Array.isArray(blocks) ? blocks : []).map((b) => (typeof b === 'string' ? b : b.h || b.quote || (b.list || []).join(' '))).join(' ')
