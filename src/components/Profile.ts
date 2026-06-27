import * as config from '../config'

interface UserClient {
  logined: boolean
  name: string
  admin: boolean
  avatarUrl: string | null
  description?: string | null
}

let DataUser;

const response = await fetch(`${config.BACKEND_URL}/api/me`, {
  method: 'GET',
  credentials: 'include'
})

const data = await response.json()
try {
if (data.user) {
  DataUser = {
    logined: true,
    name: data.user.login,
    admin: data.user.admin || false,
    avatarUrl: data.user.avatarUrl || null,
    description: data.user.description || null
  }
}
} catch {}


if (DataUser){
var user: UserClient = {
  logined: DataUser.logined || false,
  name: DataUser.name || "",
  admin: DataUser.admin || false,
  avatarUrl: DataUser.avatarUrl || null,
  description: DataUser.description || null
}
} else {
var user: UserClient = {
  logined: false,
  name: "",
  admin: false,
  avatarUrl: null,
  description: null
}
}

export default user