import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import UserCard from '../components/UserCard'
import { Project, ProjectFilter, Celebrity, UserCards } from '../types'
import * as config from '../config'

export default function Search(){
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('new')
  const [searchParams] = useSearchParams()
  const searchName: string = searchParams.get('name') || ''
  const searchType: string = searchParams.get('type') || 'project'
  const isProject: boolean = searchType === 'project'

  const projects: Project[] = [
    {
      id: 380,
      title: 'Первый админ пост',
      author: 'Admin',
      type: 'Пост',
      imageUrl: null,
      likes: 15,
      comments: 4,
      views: 20
    }
  ]

  const users: User[] = [{
    id: 2,
    name: "GamerDev12672",
    avatarUrl: null,
    rankIcon: Celebrity,
    rankTitle: 'something'
  }]

  return (
    <>
      {isProject ? (
        <>
          <div className="projects">
            <div className="p-title">Найдены проекты по запросу: {searchName}</div>
            <div className="p-buttons"></div>
          </div>
          <div className="project-projects">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="projects">
            <div className="p-title">Найдены пользователи по запросу: {searchName}</div>
            <div className="p-buttons"></div>
          </div>
          <div className="project-projects">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </>
      )}
    </>
  )
}


/*
useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${config.BACKEND_URL}/api/projects?sort=${activeFilter}`)
        const data = await response.json()
        setProjects(data) 
      } catch (error) {
        console.error('Ошибка загрузки проектов', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [activeFilter]) 


  */