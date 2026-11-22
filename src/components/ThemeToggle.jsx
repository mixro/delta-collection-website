import { useTheme } from '../lib/theme'
import { MoonIcon, SunIcon } from './Icons'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button className="icon-btn theme-toggle" onClick={toggle} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
