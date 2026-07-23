import { useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project, ProjectFilter } from '../types'
import * as config from '../config'
import Linkify from 'linkify-react'
import user from '../components/Profile'

export default function MyProfile() {
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [description, setDescription] = useState<string>(user.description || '')
  const [tempDescription, setTempDescription] = useState(description)
  const [profileImage, setProfileImage] = useState(user.avatarUrl || `${config.STATIC_LOCATION}/emptyprofile.png`)
  const [urlInput, setUrlInput] = useState('')
  const [isEditingImage, setIsEditingImage] = useState(false)

  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('new')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchProjects = async (pageNum: number, sort: ProjectFilter) => {
    setIsLoadingProjects(true)
    try {
      const response = await fetch(
        `${config.BACKEND_URL}/api/user/${user.id}/projects?page=${pageNum}&sort=${sort}`,
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
      setIsLoadingProjects(false)
    }
  }

  useEffect(() => {
    if (user.logined) {
      fetchProjects(1, activeFilter)
    }
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

  const handleSaveDescription = async () => {
    const newDesc = tempDescription.slice(0, 1024).replace(/\n/g, ' ')
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/change/description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ description: newDesc })
      })
      if (response.ok) {
        user.description = newDesc
        setDescription(newDesc)
        setIsEditingDesc(false)
      } else {
        alert('Ошибка сохранения описания')
      }
    } catch (error) {
      console.error('Ошибка сохранения описания', error)
      alert('Ошибка сети')
    }
  }

  const handleImageUrlSubmit = async () => {
    if (urlInput.trim()) {
      try {
        const response = await fetch(`${config.BACKEND_URL}/api/change/avatarUrl`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ avatarUrl: urlInput.trim() })
        })
        if (response.ok) {
          setProfileImage(urlInput.trim())
          user.avatarUrl = urlInput.trim()
          setUrlInput('')
          setIsEditingImage(false)
        } else {
          alert('Ошибка обновления аватара')
        }
      } catch (error) {
        console.error('Ошибка обновления аватара', error)
        alert('Ошибка сети')
      }
    }
  }

  const removeIconsAndTitles = async() => {
    if (confirm('Вы точно хотите сбросить у себя иконку и титул?')){
    await fetch(`${config.BACKEND_URL}/api/change/reward/title`, {
        method: 'POST',
        body: JSON.stringify({projectId: "null"}),
        credentials: 'include'
      })
    await fetch(`${config.BACKEND_URL}/api/change/reward/icon`, {
        method: 'POST',
        body: JSON.stringify({projectId: "null"}),
        credentials: 'include'
      })
    }
  }

  return (
    <>
      <div className="MyProfile">
        <div className="MP-left-side">
          <img
            src={profileImage}
            alt="profile"
            className="MPLS-img"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsEditingImage(true)}
          />
          <div className="MPLS-button">
            <button onClick={() => setIsEditingImage(true)}>
              <div className="MPLS-button-text">Изменить аватар</div>
            </button>
          </div>
          {isEditingImage && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Вставьте ссылку на изображение..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={handleImageUrlSubmit}
                style={{
                  padding: '8px 16px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Установить
              </button>
              <button
                onClick={() => {
                  setIsEditingImage(false)
                  setUrlInput('')
                }}
                style={{
                  padding: '8px 16px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
            </div>
          )}
        </div>
        <div className="MP-right-side">
          <div className="MPRS-Name">{user.name}</div>
          <div className="MPRS-button">
            {!isEditingDesc ? (
              <button
                onClick={() => {
                  setIsEditingDesc(true)
                  setTempDescription(description)
                }}
              >
                <div className="MPRS-button-text">Изменить описание</div>
              </button>
            ) : (
              <>
                <button onClick={handleSaveDescription} style={{ marginRight: '10px' }}>
                  <div className="MPRS-button-text">Сохранить</div>
                </button>
                <button
                  onClick={() => {
                    setIsEditingDesc(false)
                    setTempDescription(description)
                  }}
                >
                  <div className="MPRS-button-text">Отмена</div>
                </button>
              </>
            )}
          </div>
          <div className="MPRS-Desc">
            {!isEditingDesc ? (
              <Linkify>{user.description}</Linkify>
            ) : (
              <textarea
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                rows={4}
                cols={50}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  resize: 'vertical'
                }}
                autoFocus
              />
            )}
          </div>
          <button className="MPRS-button" style={{color:'white', background:'red', height:'24px'}} onClick={removeIconsAndTitles}>Снять титул и иконку</button>
          <h1/>
          <Link to={`/rewards?id=${user.id}`} className="MPRS-button" style={{width:'108px', height:'36px', color:'white'}} >Мои награды</Link> 
        </div>
      </div>

      <div className="projects">
        <div className="p-title">Мои проекты:</div>
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
            У вас пока нет проектов. Создайте первый!
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
          <span style={{ fontSize: '14px', color: '#666' }}>
            Страница {page} из {totalPages} ({total} проектов)
          </span>
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