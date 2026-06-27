import * as config from '../config'
import {UserClient} from '../types'

let user: UserClient = {
  logined: false,
  name: "",
  admin: false,
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
          logined: true,
          name: data.user.username || data.user.login || "",
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