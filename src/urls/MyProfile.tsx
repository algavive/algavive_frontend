import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
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
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('new')

  const projects: Project[] = [
    {
      id: 380,
      title: 'Первый проект',
      author: 'John Doe',
      type: 'Пост',
      imageUrl: null,
      likes: 15,
      comments: 4,
      views: 20
    }
  ]

  const handleSaveDescription = () => {
    const newDesc = tempDescription.slice(0, 1024).replace(/\n/g, ' ')
    user.description = newDesc
    setDescription(newDesc)
    setIsEditingDesc(false)
  }

  const handleCancelDescription = () => {
    setTempDescription(description)
    setIsEditingDesc(false)
  }

  const handleImageUrlSubmit = () => {
    if (urlInput.trim()) {
      setProfileImage(urlInput.trim())
      user.avatarUrl = urlInput.trim()
      setUrlInput('')
      setIsEditingImage(false)
    }
  }

  const handleFilterChange = (filter: ProjectFilter) => {
    setActiveFilter(filter)
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
                <button onClick={handleCancelDescription}>
                  <div className="MPRS-button-text">Отмена</div>
                </button>
              </>
            )}
          </div>
          <div className="MPRS-Desc">
            {!isEditingDesc ? (
              <Linkify>{description}</Linkify>
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

      <div className="project-projects">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  )
}