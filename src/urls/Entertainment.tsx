import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project } from '../types'
import * as config from '../config'

export default function Entertainment() {
  const [activeFilter, setActiveFilter] = useState<'new' | 'popular' | 'discussed'>('new')
  

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

  const handleFilterChange = (filter: 'new' | 'popular' | 'discussed') => {
    setActiveFilter(filter)
  }
  return (
    <>
      <div className="projects">
        <div className="p-title">Центр развлечений:</div>
        <div className="p-buttons">
          <div className="p-buttons">
          {/* Кнопки фильтров */}
          <button 
            className={activeFilter === 'new' ? 'active' : ''}
            onClick={() => handleFilterChange('new')}
          >
            Новые
          </button>
          <button 
            className={activeFilter === 'popular' ? 'active' : ''}
            onClick={() => handleFilterChange('popular')}
          >
            Популярные
          </button>
          <button 
            className={activeFilter === 'discussed' ? 'active' : ''}
            onClick={() => handleFilterChange('discussed')}
          >
            Обсуждаемые
          </button>
        </div>
        </div>
      </div>
      <div className="project-projects">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  )

}