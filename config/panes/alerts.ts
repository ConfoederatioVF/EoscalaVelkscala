import JSON5 from 'json5'
import rawAlertsConfig from './alerts.json5?raw'
import { onConfigUpdate } from '@framework/config/config_hot_reload'

export interface AlertStyle {
  title: string
  icon: string
  borderColour: string
  bgColour: string
  titleColour: string
  iconColour: string
}

export let ALERT_CONFIGS: Record<string, AlertStyle> = JSON5.parse(rawAlertsConfig)

//Keep in-place object reference synchronised on hot reload
onConfigUpdate('alerts', (arg0_next_config) => {
  if (arg0_next_config && typeof arg0_next_config === 'object') {
    let all_keys = Object.keys(ALERT_CONFIGS)
    for (let i = 0; i < all_keys.length; i++)
      delete (ALERT_CONFIGS as any)[all_keys[i]]
    Object.assign(ALERT_CONFIGS, arg0_next_config)
  }
})

