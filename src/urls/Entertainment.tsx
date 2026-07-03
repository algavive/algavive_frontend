import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project, ProjectFilter } from '../types'
import * as config from '../config'

export default function Entertainment() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('new')
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchProjects = async (pageNum: number, sort: ProjectFilter) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${config.BACKEND_URL}/api/entertainment?page=${pageNum}&sort=${sort}`,
        { credentials: 'include' }
      )
      const data = await response.json()
      if (response.ok) {
        setProjects(data.projects || [])
        setTotal(data.total || 0)
        setPage(data.page || 1)
        setTotalPages(data.totalPages || 1)
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects(1, activeFilter)
  }, [activeFilter])

  const handleFilterChange = (filter: ProjectFilter) => {
    setActiveFilter(filter)
    setPage(1)
  }

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    fetchProjects(newPage, activeFilter)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="projects">
        <div className="p-title">Центр развлечений:</div>
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

      {isLoading && <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>}

      <div className="project-projects">
        {!isLoading && projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            В центре развлечений пока нет проектов
          </div>
        )}
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '20px 0', marginTop: '20px' }}>
          <button disabled={page <= 1} onClick={() => goToPage(1)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}>&lt;&lt;</button>
          <button disabled={page <= 1} onClick={() => goToPage(page - 1)} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}>← Назад</button>
          <span style={{ fontSize: '14px', color: '#666' }}>Страница {page} из {totalPages} ({total} проектов)</span>
          <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}>Вперед →</button>
          <button disabled={page >= totalPages} onClick={() => goToPage(totalPages)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}>&gt;&gt;</button>
        </div>
      )}
    </>
  )
}