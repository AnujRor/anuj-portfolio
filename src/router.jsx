import { useEffect, useState } from 'react'

// Minimal pathname router (no dependency): navigate() pushes history, usePath() re-renders on change.
const EVENT = 'app:navigate'

export function navigate(to) {
  const [path, hash] = to.split('#')
  const target = path || '/'
  if (target !== window.location.pathname) {
    window.history.pushState({}, '', to)
    window.dispatchEvent(new Event(EVENT))
  } else if (hash) {
    window.history.pushState({}, '', to)
  }
  // Wait a frame so the new page is rendered before scrolling
  requestAnimationFrame(() => {
    const el = hash && document.getElementById(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  })
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    window.addEventListener(EVENT, update)
    window.addEventListener('popstate', update)
    return () => {
      window.removeEventListener(EVENT, update)
      window.removeEventListener('popstate', update)
    }
  }, [])
  return path
}

// <a> that routes client-side but still works with ctrl/cmd-click and "open in new tab"
export function Link({ to, onClick, ...rest }) {
  const handle = (e) => {
    onClick?.(e)
    const isLeftClick = e.button === 0
    const isTouch = e.button == null
    if (e.defaultPrevented || (!isLeftClick && !isTouch) || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handle} {...rest} />
}
