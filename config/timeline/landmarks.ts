import { useState, useEffect } from 'react'
import JSON5 from 'json5'
import rawLandmarksConfig from './landmarks.json5?raw'
import type { UfDateObject } from '@framework/utils/uf_date'
import { onConfigUpdate } from '@framework/config/config_hot_reload'

export interface LandmarkPreset {
  date: UfDateObject
  description?: string
  id: string
  label: string
}

export let LANDMARK_PRESETS: LandmarkPreset[] = JSON5.parse(rawLandmarksConfig)

//Keep in-place array reference synchronised on hot reload
onConfigUpdate('landmarks', (arg0_next_config) => {
  if (Array.isArray(arg0_next_config)) {
    LANDMARK_PRESETS.length = 0
    LANDMARK_PRESETS.push(...arg0_next_config)
  }
})

/**
 * Hook to reactively consume LANDMARK_PRESETS with hot reloading support.
 *
 * @returns {LandmarkPreset[]}
 */
export function useLandmarkPresets (): LandmarkPreset[] {
  //Declare local instance variables
  let [presets, set_presets] = useState<LandmarkPreset[]>([...LANDMARK_PRESETS])

  //Function body
  useEffect(() => {
    let unsubscribe = onConfigUpdate('landmarks', (arg0_next_config) => {
      if (Array.isArray(arg0_next_config)) {
        LANDMARK_PRESETS.length = 0
        LANDMARK_PRESETS.push(...arg0_next_config)
        set_presets([...LANDMARK_PRESETS])
      }
    })

    //Return statement
    return () => {
      unsubscribe()
    }
  }, [])

  //Return statement
  return presets
}

