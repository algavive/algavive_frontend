import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project, ProjectFilter } from '../types'
import * as config from '../config'
import user from '../components/Profile'

export default function MyProjects() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('new')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    type: 'Пост',
    imageUrl: '',
    content: ''
  })

  const [urlInput, setUrlInput] = useState('')

  const fetchProjects = async (pageNum: number, sort: ProjectFilter) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/my-projects?page=${pageNum}&sort=${sort}`, {
        credentials: 'include'
      })
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
    if (user.logined) {
      fetchProjects(1, activeFilter)
    }
  }, [])

  useEffect(() => {
    if (user.logined) {
      fetchProjects(1, activeFilter)
    }
  }, [activeFilter])

  const goToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return
    fetchProjects(pageNum, activeFilter)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterChange = (filter: 'new' | 'popular' | 'discussed') => {
    setActiveFilter(filter)
    setPage(1)
  }

  const openModal = () => {
    if (!user.logined) {
      alert('Войдите в аккаунт')
      return
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setNewProject({
      title: '',
      description: '',
      type: 'Пост',
      imageUrl: '',
      content: ''
    })
    setUrlInput('')
    setError('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUrlSubmit = () => {
    if (urlInput.trim()) {
      setNewProject(prev => ({
        ...prev,
        imageUrl: urlInput.trim()
      }))
      setUrlInput('')
    }
  }

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) {
      setError('Введите название проекта')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/create/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newProject.title,
          type: newProject.type,
          imageUrl: newProject.imageUrl || null,
          content: newProject.content || null
        })
      })

      const data = await response.json()

      if (response.ok) {
        fetchProjects(1, activeFilter)
        closeModal()
      } else {
        setError(data.error || 'Ошибка создания проекта')
      }
    } catch (err) {
      console.log(err)
      setError('Ошибка сети, попробуйте позже')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
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
      
      <div className="createProject">
        <button onClick={openModal}>+ Создать проект</button>
      </div>

      {isLoading && <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>}
      
      <div className="project-projects">
        {!isLoading && projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            У вас пока нет проектов. Создайте первый!
          </div>
        )}
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="pagination" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px',
          padding: '20px 0',
          marginTop: '20px'
        }}>
          <button 
            disabled={page <= 1}
            onClick={() => goToPage(1)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.5 : 1
            }}
          >
            &lt;&lt;
          </button>

          <button 
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.5 : 1
            }}
          >
            ← Назад
          </button>
          
          <span style={{ fontSize: '14px', color: '#666' }}>
            Страница {page} из {totalPages} ({total} проектов)
          </span>
          
          <button 
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages ? 0.5 : 1
            }}
          >
            Вперед →
          </button>

          <button 
            disabled={page >= totalPages}
            onClick={() => goToPage(totalPages)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages ? 0.5 : 1
            }}
          >
            &gt;&gt;
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Создать проект</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="title">Название проекта *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProject.title}
                  onChange={handleInputChange}
                  placeholder="Введите название проекта"
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Тип проекта</label>
                <select
                  id="type"
                  name="type"
                  value={newProject.type}
                  onChange={handleInputChange}
                >
                  <option value="Пост">Пост</option>
                  <option value="Scratch">Scratch</option>
                  <option value="Видео">Видео</option>
                  <option value="Web">Web</option>
                </select>
              </div>

              {newProject.type !== 'Пост' && (
                <div className="form-group">
                  <label htmlFor="content">
                    {newProject.type === 'Scratch' && 'Ссылка на .sb3 файл'}
                    {newProject.type === 'Видео' && 'Ссылка на видео'}
                    {newProject.type === 'Web' && 'Ссылка на сайт'}
                  </label>
                  <input
                    type="text"
                    id="content"
                    name="content"
                    value={newProject.content}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="imageUrl">Ссылка на изображение (опционально)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Вставьте ссылку на изображение..."
                    style={{ 
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <button 
                    onClick={handleImageUrlSubmit}
                    style={{
                      padding: '10px 20px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Добавить
                  </button>
                </div>
                {newProject.imageUrl && (
                  <div className="image-preview">
                    <img 
                      src={newProject.imageUrl} 
                      alt="Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px', objectFit: 'contain' }}
                    />
                    <button 
                      onClick={() => setNewProject(prev => ({ ...prev, imageUrl: '' }))}
                      style={{
                        marginTop: '5px',
                        padding: '4px 12px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>

              {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Отмена</button>
              <button 
                className="btn-create" 
                onClick={handleCreateProject}
                disabled={isCreating}
                style={{
                  opacity: isCreating ? 0.7 : 1,
                  cursor: isCreating ? 'not-allowed' : 'pointer'
                }}
              >
                {isCreating ? 'Создание...' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}