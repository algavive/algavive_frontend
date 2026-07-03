import { useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import { Project, ProjectFilter, Celebrity } from '../types'
import * as config from '../config'
import Linkify from 'linkify-react'

interface UserProfile {
  id: number
  name: string
  avatarUrl: string | null
  rankIcon?: string
  rankTitle?: string
  description?: string
  admin: boolean
}

export default function User() {
  const [searchParams]  = useSearchParams()
  const id = searchParams.get('id')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('new')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!id) {
      setIsLoadingUser(false)
      return
    }
    fetchUser()
    fetchProjects(1, activeFilter)
  }, [id])

  const fetchUser = async () => {
    setIsLoadingUser(true)
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/user/${id}`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователя', error)
      setUser(null)
    } finally {
      setIsLoadingUser(false)
    }
  }

  const fetchProjects = async (pageNum: number, sort: ProjectFilter) => {
    if (!id) return
    setIsLoadingProjects(true)
    try {
      const response = await fetch(
        `${config.BACKEND_URL}/api/user/${id}/projects?page=${pageNum}&sort=${sort}`,
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
      console.error('Ошибка загрузки проектов пользователя', error)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const handleFilterChange = (filter: ProjectFilter) => {
    setActiveFilter(filter)
    setPage(1)
    fetchProjects(1, filter)
  }

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    fetchProjects(newPage, activeFilter)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoadingUser) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка пользователя...</div>
  }

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Пользователь не найден</div>
  }

  return (
    <>
      <div className="MyProfile">
        <div className="MP-left-side">
          <img
            src={user.avatarUrl || `${config.STATIC_LOCATION}/emptyprofile.png`}
            alt="profile"
            className="MPLS-img"
          />
        </div>
        <div className="MP-right-side">
          <div className="MPRS-Name">
            {user.name}
            {user.rankIcon && (
              <img src={user.rankIcon} style={{ height: '24px', marginLeft: '8px' }} alt="rank" />
            )}
            {user.rankTitle && (
              <div style={{ color: 'purple', fontSize: '14px' }}>{user.rankTitle}</div>
            )}
          </div>
          <div className="MPRS-Desc">
            {user.description ? <Linkify>{user.description}</Linkify> : <h1 style={{color: 'red'}}>Описание отсутствует</h1>}
          </div>
        </div>
      </div>

      <div className="projects">
        <div className="p-title">Проекты пользователя:</div>
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

      {isLoadingProjects && <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка проектов...</div>}

      <div className="project-projects">
        {!isLoadingProjects && projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            У этого пользователя пока нет опубликованных проектов
          </div>
        )}
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {!isLoadingProjects && totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '20px 0', marginTop: '20px' }}>
          <button
            disabled={page <= 1}
            onClick={() => goToPage(1)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}
          >
            &lt;&lt;
          </button>
          <button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}
          >
            ← Назад
          </button>
          <span style={{ fontSize: '14px', color: '#666' }}>Страница {page} из {totalPages} ({total} проектов)</span>
          <button
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}
          >
            Вперед →
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => goToPage(totalPages)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </>
  )
}