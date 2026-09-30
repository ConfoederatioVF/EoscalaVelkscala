import { useState, useEffect } from 'react'
import JSON5 from 'json5'
import rawMapmodesConfig from '../panes/mapmodes.json5?raw'
import { MapModeId } from '@framework/geopng/types'
import { onConfigUpdate } from '@framework/config/config_hot_reload'

export interface MapmodeConfigItem {
  id: MapModeId
  label: string
  description?: string
  active?: boolean
  controlDescription?: string
}

export interface MapmodesConfig {
  modes: MapmodeConfigItem[]
  controlsFooter: string[]
}

export let MAPMODES_CONFIG: MapmodesConfig = JSON5.parse(rawMapmodesConfig)

//Keep in-place object reference synchronised on hot reload
onConfigUpdate('mapmodes', (arg0_next_config) => {
  if (arg0_next_config && typeof arg0_next_config === 'object')
    Object.assign(MAPMODES_CONFIG, arg0_next_config)
})

/**
 * Hook to reactively consume MAPMODES_CONFIG with hot reloading support.
 *
 * @returns {MapmodesConfig}
 */
export function useMapmodesConfig (): MapmodesConfig {
  //Declare local instance variables
  let [config, set_config] = useState<MapmodesConfig>(MAPMODES_CONFIG)

  //Function body
  useEffect(() => {
    let unsubscribe = onConfigUpdate('mapmodes', (arg0_next_config) => {
      if (arg0_next_config && typeof arg0_next_config === 'object') {
        Object.assign(MAPMODES_CONFIG, arg0_next_config)
        set_config({ ...MAPMODES_CONFIG })
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

