//Я пока ищу смысл в этих типах

export interface Project {
  id: number
  title: string
  author: string
  type: string
  imageUrl: string
  likes: number
  comments: number
}

export type TrendPeriod = 'day' | 'week' | 'month'
export type ProjectFilter = 'new' | 'popular' | 'discussed'