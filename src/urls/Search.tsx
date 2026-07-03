import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import UserCard from '../components/UserCard'
import { Project, UserCards, ProjectFilter } from '../types'
import * as config from '../config'

export default function Search() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('new')
  const [searchParams] = useSearchParams()
  const searchName: string = searchParams.get('name') || ''
  const searchType: string = searchParams.get('type') || 'project'
  const isProject: boolean = searchType === 'project'

  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<UserCards[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!searchName.trim()) {
      setProjects([])
      setUsers([])
      return
    }

    const fetchSearch = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${config.BACKEND_URL}/api/search?name=${encodeURIComponent(searchName)}&type=${searchType}&sort=${activeFilter}`,
          { credentials: 'include' }
        )
        const data = await response.json()
        if (response.ok) {
          if (isProject) {
            setProjects(data.projects || [])
          } else {
            setUsers(data.users || [])
          }
        }
      } catch (error) {
        console.error('Ошибка поиска', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearch()
  }, [searchName, searchType, activeFilter])

  return (
    <>
      {isProject ? (
        <>
        <h1/>
          <div className="p-title">Найдено проектов по запросу: {searchName}</div>
          <div className="projects">
            <div className="p-buttons">
              <button
                className={activeFilter === 'new' ? 'active' : ''}
                onClick={() => setActiveFilter('new')}
              >
                Новые
              </button>
              <button
                className={activeFilter === 'popular' ? 'active' : ''}
                onClick={() => setActiveFilter('popular')}
              >
                Популярные
              </button>
              <button
                className={activeFilter === 'discussed' ? 'active' : ''}
                onClick={() => setActiveFilter('discussed')}
              >
                Обсуждаемые
              </button>
            </div>
          </div>
          <div className="project-projects">
            {isLoading ? (
              <div>Загрузка...</div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Проектов не найдено
              </div>
            ) : (
              projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="projects">
            <div className="p-title">Найдено пользователей по запросу: {searchName}</div>
            <div className="p-buttons"></div>
          </div>
          <div className="project-projects">
            {isLoading ? (
              <div>Загрузка...</div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Пользователей не найдено
              </div>
            ) : (
              users.map(user => (
                <UserCard key={user.id} user={user} />
              ))
            )}
          </div>
        </>
      )}
    </>
  )
}