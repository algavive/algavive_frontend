import * as config from '../config'
import {UserClient} from '../types'

export interface UserClient {
  id: number
  logined: boolean
  name: string
  admin?: number
  hasGoogle?: boolean
  avatarUrl: string | null
  description?: string | null
  userIcon?: string
  userTitle?: string
}

let user: UserClient = {
  id: -1,
  logined: false,
  name: "",
  admin: 0,
  avatarUrl: null,
  description: null
}

export async function loadUser() {
  try {
    const res = await fetch(`${config.BACKEND_URL}/api/me`, {
      credentials: 'include'
    })
    
    if (res.ok) {
      const data = await res.json()
      if (data.user) {
        user = {
          id: data.user.id,
          logined: true,
          name: data.user.username || data.user.login || "",
          hasGoogle: data.user.hasGoogle,
          admin: data.user.admin || false,
          avatarUrl: data.user.avatarUrl || null,
          description: data.user.description || null
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
  return user
}

await loadUser()

export default user