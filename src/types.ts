import * as config from '../config'

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

  isLiked: boolean
  isOwner: boolean

  type: string
  imageUrl: string | null
  likes: number
  comments: number
  views: number
  description: string

  imageUrl: string
  content: string | string[]
}

export interface UserCard {
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
  desc: string
}

export interface Reply {
  id: number,
  author: string,
  authorId: number,
  text: string,
  date: string,
  rankIcon?: string,
  rankTitle?: string
}

export interface Comments {
  id: number,
  author: string,
  authorId: number,
  text: string,
  date: string,
  rankIcon?: string,
  rankTitle?: string,
  replies: Reply[]
}

export const Celebrity: string = `${config.STATIC_LOCATION}/seleba.png`
export const EmptyCover: string = `${config.STATIC_LOCATION}/cover.png`

export type TrendPeriod = 'day' | 'week' | 'month'
export type ProjectFilter = 'new' | 'popular' | 'discussed'
export type ProjectsTypes = 'Пост' | 'Видео' | 'Scratch' | 'Web'  