//Я пока ищу смысл в этих типах

export interface Project {
  id: number
  title: string
  author: string
  type: string
  imageUrl: string | null
  likes: number
  comments: number
  views: number
}
/*
export interface PageProject {
  id: number
  title: string
  author: string
  type: string
  imageUrl: string | null
  likes: number
  comments: number
  desc: string
}*/

export type TrendPeriod = 'day' | 'week' | 'month'
export type ProjectFilter = 'new' | 'popular' | 'discussed'