import { useState, useEffect } from 'react'
import JSON5 from 'json5'
import rawInfoConfig from './info.json5?raw'
import { onConfigUpdate } from '@framework/config/config_hot_reload'

export interface InfoPanelShortcut {
  key: string
  action: string
}

export interface InfoPanelSection {
  heading: string
  text: string
}

export interface MarkdownSectionItem {
  title?: string
  heading?: string
  summary?: string
  content?: string | string[]
  text?: string | string[]
  defaultOpen?: boolean
  open?: boolean
}

export type TabMarkdownContent = string | string[] | MarkdownSectionItem[]

export interface InfoPanelTab {
  id: string
  label: string
  icon?: string
  type: 'controls' | 'content' | string
  title?: string
  description?: string
  badge?: string
  shortcutsHeader?: string
  shortcuts?: InfoPanelShortcut[]
  markdown?: TabMarkdownContent
  content?: TabMarkdownContent
  sections?: InfoPanelSection[]
}

export interface InfoPanelConfig {
  title: string
  defaultTab?: string
  tabs: InfoPanelTab[]
}

export let INFO_PANEL_CONFIG: InfoPanelConfig = JSON5.parse(rawInfoConfig)

//Keep in-place object reference synchronised on hot reload
onConfigUpdate('info', (arg0_next_config) => {
  if (arg0_next_config && typeof arg0_next_config === 'object')
    Object.assign(INFO_PANEL_CONFIG, arg0_next_config)
})

/**
 * Hook to reactively consume INFO_PANEL_CONFIG with hot reloading support.
 *
 * @returns {InfoPanelConfig}
 */
export function useInfoPanelConfig (): InfoPanelConfig {
  //Declare local instance variables
  let [config, set_config] = useState<InfoPanelConfig>(INFO_PANEL_CONFIG)

  //Function body
  useEffect(() => {
    let unsubscribe = onConfigUpdate('info', (arg0_next_config) => {
      if (arg0_next_config && typeof arg0_next_config === 'object') {
        Object.assign(INFO_PANEL_CONFIG, arg0_next_config)
        set_config({ ...INFO_PANEL_CONFIG })
      }
    })

    //Return statement
    return () => {
      unsubscribe()
    }
  }, [])

  //Return statement
  return config
}

