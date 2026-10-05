export function getTheme() {
  try { return localStorage.getItem('theme') ?? 'system' } catch { return 'system' }
}

export function listenThemeChange() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') setTheme('system')
  })
}

export function setTheme(theme?: string, save = false) {
  const preference = theme ?? (save
    ? (document.documentElement.classList.contains('dark') ? 'light' : 'dark')
    : getTheme())
  if (!['system', 'dark', 'light'].includes(preference)) return
  if (save) {
    try { localStorage.setItem('theme', preference) } catch {}
  }
  const dark = preference === 'dark' || (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',
    `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()})`
  )
  return preference
}
