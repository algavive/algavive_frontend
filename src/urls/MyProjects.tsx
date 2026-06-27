
import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project,ProjectFilter } from '../types'
import * as config from '../config'
import user from '../components/Profile'

export default function MyProjects() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('new')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1234,
      title: 'абвгдейка',
      author: 'абвгдеевич',
      type: 'Пост',
      imageUrl: null,
      likes: 15,
      comments: 4,
      views: 20
    }
  ])
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    type: 'Пост',
    imageUrl: ''
  })

  const [urlInput, setUrlInput] = useState('')

  const handleFilterChange = (filter: 'new' | 'popular' | 'discussed') => {
    setActiveFilter(filter)
  }

  const openModal = () => {
    if(!user.logined) return
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setNewProject({
      title: '',
      description: '',
      type: 'Пост',
      imageUrl: ''
    })
    setUrlInput('')
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

  const handleCreateProject = () => {
    if (!newProject.title.trim()) {
      alert('Введите название проекта')
      return
    }

    const project: Project = {
      id: Date.now(),
      title: newProject.title,
      author: 'John Doe',
      type: newProject.type,
      imageUrl: newProject.imageUrl || null,
      likes: 0,
      comments: 0,
      views: 0
    }

    setProjects(prev => [project, ...prev])
    closeModal()
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
      
      <div className="project-projects">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

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
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Отмена</button>
              <button className="btn-create" onClick={handleCreateProject}>Создать</button>
            </div>
          </div>
        </div>
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

/*
    const formData = new FormData()
    formData.append('title', newProject.title)
    formData.append('description', newProject.description)
    formData.append('type', newProject.type)
    if (newProject.image) {
      formData.append('image', newProject.image)
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/projects`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setProjects(prev => [data, ...prev])
      closeModal()
    } catch (error) {
      console.error('Ошибка создания проекта', error)
    }
    */

/*
    const formData = new FormData()
    formData.append('title', newProject.title)
    formData.append('description', newProject.description)
    formData.append('type', newProject.type)
    if (newProject.image) {
      formData.append('image', newProject.image)
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/projects`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setProjects(prev => [data, ...prev])
      closeModal()
    } catch (error) {
      console.error('Ошибка создания проекта', error)
    }
    */


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