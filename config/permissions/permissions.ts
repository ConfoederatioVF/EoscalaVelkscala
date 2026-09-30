import JSON5 from 'json5'
import rawPermissionsConfig from './permissions.json5?raw'
import { onConfigUpdate } from '@framework/config/config_hot_reload'

export interface RoleDefinition {
  id: string
  name: string
  description: string
  features: string[]
  allowed_layers: string[]
  discord?: {
    channel_id?: string
    role_ids?: string[]
  }
}

export interface PermissionsConfig {
  allowed_roles_in_public?: string[]
  default_role: string
  is_public_build?: boolean
  roles: Record<string, RoleDefinition>
}

export type UserRole = 'default' | 'privileged' | 'developer'

export let PERMISSIONS_CONFIG: PermissionsConfig = JSON5.parse(rawPermissionsConfig)

//Keep in-place object reference synchronised on hot reload
onConfigUpdate('permissions', (arg0_next_config) => {
  if (arg0_next_config && typeof arg0_next_config === 'object')
    Object.assign(PERMISSIONS_CONFIG, arg0_next_config)
})

/**
 * Returns whether the application is running in a public build instance.
 *
 * @returns {boolean}
 */
export let isPublicBuild = function () {
  //Convert from parameters

  //Declare local instance variables
  let env_public: string | undefined
  let is_public: boolean

  //Function body
  env_public = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_PUBLIC_BUILD as string | undefined) : undefined
  is_public = PERMISSIONS_CONFIG.is_public_build === true || env_public === 'true'

  //Return statement
  return is_public
}


/**
 * Validates whether a specific role is allowed in the current instance.
 *
 * @param {UserRole} arg0_role
 *
 * @returns {boolean}
 */
export let isRoleAllowed = function (arg0_role: UserRole) {
  //Convert from parameters
  let role = arg0_role

  //Declare local instance variables
  let allowed_roles: string[]
  let is_allowed: boolean

  //Function body
  if (isPublicBuild()) {
    allowed_roles = PERMISSIONS_CONFIG.allowed_roles_in_public || ['default']
    is_allowed = allowed_roles.includes(role)

    //Return statement
    return is_allowed
  }

  //Return statement
  return true
}
