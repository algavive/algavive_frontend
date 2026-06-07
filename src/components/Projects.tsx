import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project } from '../types'
import * as config from '../config'

const Projects = () => {
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
      id: 7,
      title: 'Эмулятор нес',
      author: 'turip ip turip',
      type: 'Веб',
      imageUrl: `${config.STATIC_LOCATION}/cover.png`,
      likes: 15,
      comments: 4
    },
    {
      id: 8,
      title: '3д движок(который скомпилирован с турбоварп)',
      author: 'StarDev',
      type: 'Html',
      imageUrl: `${config.STATIC_LOCATION}/cover.png`,
      likes: 120,
      comments: 45
    }
  ]

  const handleFilterChange = (filter: 'new' | 'popular' | 'discussed') => {
    setActiveFilter(filter)
  }

  return (
    <>
      <div className="projects">
        <div className="p-title">Проекты:</div>
        <div className="p-buttons">
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
      <div className="trends-projects">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  )
}

export default Projects