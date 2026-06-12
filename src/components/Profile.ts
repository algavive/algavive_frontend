//Потом вставлю api kjubre
interface User {
	logined: boolean
	name: string
	admin: boolean
	avatarUrl: string | null
}

export const user: User = {
  logined: true,
  name: "John Doe",
  admin: true,
  avatarUrl: null
}