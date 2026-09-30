import JSON5 from 'json5'
import rawMapConfig from './map.json5?raw'
import { onConfigUpdate } from '@framework/config/config_hot_reload'

export interface BasemapDefinition {
  id: 'dark' | 'light' | 'satellite' | 'topo' | 'none'
  label: string
  url?: string
  attribution?: string
}

export interface MapDefines {
  initialMercator: {
    longitude: number
    latitude: number
    zoom: number
    pitch: number
    bearing: number
    maxZoom: number
    minZoom: number
    pixelOffset?: number
  }
  initialGlobe: {
    longitude: number
    latitude: number
    zoom: number
    pitch: number
    bearing: number
    maxZoom: number
    minZoom: number
    pixelOffset?: number
  }
  initialEquirectangular: {
    target: [number, number, number]
    zoom: number
    minZoom: number
    maxZoom: number
    pixelOffset?: number
  }
  initialEqualEarth?: {
    target: [number, number, number]
    zoom: number
    minZoom: number
    maxZoom: number
    pixelOffset?: number
  }
  graticule: {
    latInterval: number
    lngInterval: number
    color: [number, number, number, number]
  }
}

export interface MapConfig {
  defaultPercentileBreaks: string
  desktopPickRadius?: number
  equalEarthPixelOffset?: number
  equirectangularPixelOffset?: number
  globePixelOffset?: number
  mapDefines: MapDefines
  mercatorPixelOffset?: number
  touchPickRadius?: number
  basemapLayers: BasemapDefinition[]
}

export let MAP_CONFIG: MapConfig = JSON5.parse(rawMapConfig)

//Keep in-place object reference synchronised on hot reload
onConfigUpdate('map', (arg0_next_config) => {
  if (arg0_next_config && typeof arg0_next_config === 'object')
    Object.assign(MAP_CONFIG, arg0_next_config)
})

/**
 * Returns the configured pixel offset for a given projection mode.
 * Defaults to -1 if unspecified.
 *
 * @param {string} arg0_projection
 *
 * @returns {number}
 */
export function getPixelOffset (arg0_projection: string): number {
  //Convert from parameters
  let projection = arg0_projection

  //Declare local instance variables
  let defs = MAP_CONFIG.mapDefines as any

  //Guard clauses
  if (!defs)
    return -1

  //Function body
  if (projection === 'Mercator') {
    return defs.initialMercator?.pixelOffset ?? defs.mercator?.pixelOffset ?? MAP_CONFIG.mercatorPixelOffset ?? -1
  } else if (projection === 'Globe') {
    return defs.initialGlobe?.pixelOffset ?? defs.globe?.pixelOffset ?? MAP_CONFIG.globePixelOffset ?? -1
  } else if (projection === 'Equirectangular') {
    return defs.initialEquirectangular?.pixelOffset ?? defs.equirectangular?.pixelOffset ?? MAP_CONFIG.equirectangularPixelOffset ?? -1
  } else if (projection === 'EqualEarth') {
    return defs.initialEqualEarth?.pixelOffset ?? defs.equalEarth?.pixelOffset ?? MAP_CONFIG.equalEarthPixelOffset ?? -1
  }

  //Return statement
  return -1
}
