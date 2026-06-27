interface UserClient {
  logined: boolean
  name: string
  admin: boolean
  avatarUrl: string | null
  description?: string | null
}

const user: UserClient = {
  logined: false,
  name: "John Doe",
  admin: false,
  avatarUrl: null,
  description: null
}

export default user