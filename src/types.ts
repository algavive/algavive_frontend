import * as config from './config'


export interface Project {
  id: number
  title: string
  author: string
  authorIcon?: string
  authorTitle?: string
  authorProfile?: string
  type: string
  imageUrl: string | null
  likes: number
  comments: number
  views: number
}

export interface PageProject {
  id: number
  title: string
  author: string
  authorId: number
  authorProfile?: null | string

  isLiked: boolean
  isOwner: boolean

  type: string
  imageUrl: string | null
  likes: number
  comments: number
  views: number
  description: string

  content: string | string[]
}

export interface UserCards {
  id: number
  name: string
  rankIcon?: string
  rankTitle?: string
  avatarUrl: null | string
}

export interface UserProfile {
  id: number
  name: string
  rankIcon?: string
  rankTitle?: string
  avatarUrl: null | string
  description?: string
}

export interface Reply {
  id: number,
  author: string,
  authorId: number,
  content: string,
  date: string,
  rankIcon?: string,
  rankTitle?: string,
  authorProfile: string
}

export interface Comments {
  id: number,
  author: string,
  authorId: number,
  content: string,
  date: string,
  rankIcon?: string,
  rankTitle?: string,
  authorProfile: string,
  replies: Reply[]
}

export interface Notifications {
  id: number,
  type: string,
  user: string,
  action: string,
  target: string,
  time: string,
  redirectUrl: string
}

export const Celebrity: string = `${config.STATIC_LOCATION}/seleba.png`
export const EmptyCover: string = `${config.STATIC_LOCATION}/cover.png`

export type TrendPeriod = 'day' | 'week' | 'month'
export type ProjectFilter = 'new' | 'popular' | 'discussed'
export type ProjectsTypes = 'Пост' | 'Видео' | 'Scratch' | 'Web'  