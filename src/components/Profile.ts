//Потом вставлю в api
interface UserClient {
	logined: boolean
	name: string
	admin: boolean
	avatarUrl: string | null
}

export const user: UserClient = {
  logined: true,
  name: "John Doe",
  admin: true,
  avatarUrl: null
}