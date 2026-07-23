import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import { Project } from '../types'
import * as config from '../config'

export default function Reward() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const userId = parseInt(id || '0')

  const [projects, setProjects] = useState<Project[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) {
      setError('Неверный ID пользователя')
      return
    }
    const fetchRewards = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch(
          `${config.BACKEND_URL}/api/user/${userId}/rewards?page=${page}&limit=12`,
          { credentials: 'include' }
        )
        const data = await response.json()
        if (response.ok) {
          setProjects(data.projects || [])
          setTotal(data.total || 0)
          setTotalPages(data.totalPages || 1)
        } else {
          setError(data.error || 'Ошибка загрузки наград')
        }
      } catch (err) {
        setError('Ошибка сети')
      } finally {
        setIsLoading(false)
      }
    }
    fetchRewards()
  }, [userId, page])

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
  }

  if (!userId) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Пользователь не указан</div>
  }

  return (
    <div className="rewards-page">
      <div className="projects">
        <div className="p-title">Награды пользователя (всего: {total})</div>
      </div>
      <div className="project-projects">
        {isLoading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>{error}</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            У этого пользователя пока нет наград
          </div>
        ) : (
          <>
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  style={{ padding: '8px 16px', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  Назад
                </button>
                <span>Страница {page} из {totalPages}</span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  style={{ padding: '8px 16px', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Вперёд
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}