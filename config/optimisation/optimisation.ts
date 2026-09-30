import fs from 'fs'
import path from 'path'
import JSON5 from 'json5'

export interface OptimisationConfig {
  downsampling_method?: 'average' | 'sum'
  downsampling_resolution?: [number, number]
  enabled?: boolean
}

export interface OptimisationInfo {
  config: OptimisationConfig
  height: number
  mtimeMs: number
  width: number
}

export let DEFAULT_OPTIMISATION_CONFIG: OptimisationConfig = {
  downsampling_method: 'sum',
  downsampling_resolution: [1920, 1080],
  enabled: true,
}

let cached_mtime = 0
let cached_opt_info: OptimisationInfo | null = null

/**
 * Returns current downsampling and optimisation configuration, tracking file modification timestamp.
 *
 * @returns {OptimisationInfo}
 */
export function getOptimisationConfig (): OptimisationInfo {
  //Declare local instance variables
  let config: OptimisationConfig = DEFAULT_OPTIMISATION_CONFIG
  let config_path = path.resolve(process.cwd(), 'common/optimisation/optimisation.json5')
  let current_mtime = 0
  let dst_h = 1080
  let dst_w = 1920

  //Function body
  try {
    if (typeof fs !== 'undefined' && fs.existsSync && fs.existsSync(config_path)) {
      let st = fs.statSync(config_path)
      current_mtime = st.mtimeMs

      if (cached_opt_info && cached_mtime === current_mtime)
        return cached_opt_info

      let raw = fs.readFileSync(config_path, 'utf8')
      config = JSON5.parse(raw)
      cached_mtime = current_mtime
    }
  } catch (arg0_err) {
    console.error('[OptimisationConfig] Error reading optimisation.json5:', arg0_err)
  }

  if (Array.isArray(config.downsampling_resolution) && config.downsampling_resolution.length >= 2) {
    dst_w = config.downsampling_resolution[0]
    dst_h = config.downsampling_resolution[1]
  }

  cached_opt_info = {
    config,
    height: dst_h,
    mtimeMs: current_mtime,
    width: dst_w,
  }

  //Return statement
  return cached_opt_info
}
