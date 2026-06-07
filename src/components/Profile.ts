//Потом вставлю api kjubre
interface User{
	logined: boolean
	name: string
	admin: boolean
	avatarUrl: string | null
}

export const user: User = {
  logined: false,
  name: "John Doe",
  admin: false,
  avatarUrl: null
}