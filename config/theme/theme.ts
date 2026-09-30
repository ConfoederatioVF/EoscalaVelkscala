import JSON5 from 'json5'
import rawThemeConfig from './theme.json5?raw'
import { onConfigUpdate } from '@framework/config/config_hot_reload'

export interface ThemeConfig {
  accentPrimary: string
  accentSecondary: string
  accentTertiary: string
  bgPrimary: string
  bgSecondary: string
  bgMuted: string
  hoverColour: string
  textPrimary: string
  textMuted: string
  iconColor: string
  toggleActive: string
  toggleInactive: string
  p99Active: string
  badgeActiveBg: string
  badgeActiveBorder: string
  badgeActiveText: string
  buttonActiveBg: string
  buttonActiveText: string
  buttonActiveBorder: string
}

export let THEME_CONFIG: ThemeConfig = JSON5.parse(rawThemeConfig)

//Keep in-place object reference synchronised on hot reload
onConfigUpdate('theme', (arg0_next_config) => {
  if (arg0_next_config && typeof arg0_next_config === 'object')
    Object.assign(THEME_CONFIG, arg0_next_config)
})

