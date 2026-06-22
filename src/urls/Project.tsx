import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import * as config from '../config'
import Linkify from 'linkify-react';

export default function Project() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [isEditing, setIsEditing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFullscreenMedia, setIsFullscreenMedia] = useState(false)
  const [fullscreenMediaIndex, setFullscreenMediaIndex] = useState(0)
  const [urlInput, setUrlInput] = useState('')
  
  const [projectData, setProjectData] = useState({
    title: "Мэднесс комбат",
    type: "Пост",
    author: "GamerDev12672",
    authorId: 8273983,
    views: 20,
    likes: 37,
    isLiked: false,
    commentsCount: 5,
    description: `Добро пожаловать в мэднесс комбат!\n\nЕсли хотите поиграть то переходите по ссылке https://madness.com`,
    imageUrl: `${config.STATIC_LOCATION}/cover.png`,
    content: '',
    isOwner: true
  })

  const [editData, setEditData] = useState({
    title: projectData.title,
    description: projectData.description,
    imageUrl: projectData.imageUrl,
    content: projectData.content || []
  })

  const [commentsData, setCommentsData] = useState([
    {
      id: 1,
      author: "GamerDev12672",
      authorId: 8273983,
      text: "Отличная игра! Всем рекомендую 🔥",
      date: "2024-01-15",
      replies: [
        {
          id: 2,
          author: "ProGamer",
          authorId: 5555555,
          text: "Согласен, лучшая игра в этом году!",
          date: "2024-01-15"
        },
        {
          id: 4,
          author: "NoobMaster",
          authorId: 7777777,
          text: "Полностью поддерживаю!",
          date: "2024-01-16"
        }
      ]
    },
    {
      id: 3,
      author: "CoolPlayer",
      authorId: 1234567,
      text: "Когда будет обновление?",
      date: "2024-01-16",
      replies: [
        {
          id: 5,
          author: "GamerDev12672",
          authorId: 8273983,
          text: "На следующей неделе!",
          date: "2024-01-17"
        }
      ]
    }
  ])

  const [mainInput, setMainInput] = useState('')
  const [replyInputs, setReplyInputs] = useState({})
  const [showReplyForms, setShowReplyForms] = useState({})
  const [collapsedReplies, setCollapsedReplies] = useState({ 1: true, 3: true })

  const toggleProjectLike = () => {
    setProjectData({
      ...projectData,
      isLiked: !projectData.isLiked,
      likes: projectData.isLiked ? projectData.likes - 1 : projectData.likes + 1
    })
  }

  const toggleReplies = (commentId) => {
    setCollapsedReplies({
      ...collapsedReplies,
      [commentId]: !collapsedReplies[commentId]
    })
  }

  const addMainComment = () => {
    if (mainInput.trim() === '') return
    
    const newComment = {
      id: Date.now(),
      author: "CurrentUser",
      authorId: 9999999,
      text: mainInput,
      date: new Date().toISOString().split('T')[0],
      replies: []
    }
    
    setCommentsData([newComment, ...commentsData])
    setMainInput('')
  }

  const showReplyForm = (commentId) => {
    setShowReplyForms({
      ...showReplyForms,
      [commentId]: !showReplyForms[commentId]
    })
    setReplyInputs({
      ...replyInputs,
      [commentId]: ''
    })
  }

  const addReply = (parentId) => {
    const replyText = replyInputs[parentId]
    if (!replyText || replyText.trim() === '') return
    
    const newReply = {
      id: Date.now(),
      author: "CurrentUser",
      authorId: 9999999,
      text: replyText,
      date: new Date().toISOString().split('T')[0]
    }
    
    const updatedComments = commentsData.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [newReply, ...comment.replies]
        }
      }
      return comment
    })
    
    setCommentsData(updatedComments)
    setReplyInputs({ ...replyInputs, [parentId]: '' })
    setShowReplyForms({ ...showReplyForms, [parentId]: false })
    
    if (collapsedReplies[parentId]) {
      setCollapsedReplies({ ...collapsedReplies, [parentId]: false })
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setEditData({
      title: projectData.title,
      description: projectData.description,
      imageUrl: projectData.imageUrl,
      content: projectData.content || []
    })
    setUrlInput('')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUrlImport = (type) => {
    if (!urlInput.trim()) return
    
    const url = urlInput.trim()
    const extension = url.split('.').pop()?.toLowerCase()
    
    if (type === 'imageUrl') {
      setEditData(prev => ({ ...prev, imageUrl: url }))
      setUrlInput('')
    } else if (type === 'content') {
      if (projectData.type === 'Scratch' && extension === 'sb3') {
        setEditData(prev => ({ ...prev, content: url }))
        setUrlInput('')
      } else if (projectData.type === 'Видео' && ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
        setEditData(prev => ({ ...prev, content: url }))
        setUrlInput('')
      } else if (projectData.type === 'Web') {
        setEditData(prev => ({ ...prev, content: url }))
        setUrlInput('')
      } else {
        alert('Неверный формат URL для этого типа проекта')
      }
    } else if (type === 'media') {
      const mediaExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff']
      if (mediaExtensions.includes(extension)) {
        const currentContent = Array.isArray(editData.content) ? editData.content : []
        if (currentContent.length >= 10) {
          alert('Максимум 10 медиа файлов')
          return
        }
        setEditData(prev => ({
          ...prev,
          content: [...currentContent, url]
        }))
        setUrlInput('')
      } else {
        alert('Неверный формат медиа файла. Поддерживаются: png, jpg, gif, webp, svg, bmp, ico, tiff')
      }
    }
  }

  const handleSaveEdit = () => {
    setProjectData(prev => ({
      ...prev,
      title: editData.title,
      description: editData.description,
      imageUrl: editData.imageUrl,
      content: editData.content
    }))
    setIsEditing(false)
  }

  const deleteProject = () => {
    alert("Проект удален")
  }

  const openFullscreen = () => {
    if (projectData.type === 'Пост' && Array.isArray(projectData.content) && projectData.content.length > 0) {
      setFullscreenMediaIndex(0)
      setIsFullscreenMedia(true)
    } else {
      setIsFullscreen(true)
    }
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    setIsFullscreenMedia(false)
  }

  const renderCardContent = () => {
    switch (projectData.type) {
      case 'Пост': {
        const mediaArray = Array.isArray(projectData.content) ? projectData.content : []
        const displayImage = mediaArray.length > 0 ? mediaArray[0] : projectData.imageUrl
        
        return (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img 
              src={displayImage} 
              alt={projectData.title} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            {mediaArray.length > 0 && (
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
                background: 'rgba(0,0,0,0.5)',
                padding: '4px 10px',
                borderRadius: '12px',
                alignItems: 'center'
              }}>
                {mediaArray.map((_, idx) => (
                  <span key={idx} style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: idx === fullscreenMediaIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.3s'
                  }} />
                ))}
                <span style={{ color: '#fff', fontSize: '11px', marginLeft: '4px' }}>
                  {mediaArray.length}
                </span>
              </div>
            )}
          </div>
        )
      }
      case 'Видео':
        return (
          <video controls style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
            <source src={projectData.content} />
          </video>
        )
      case 'Scratch':
        return (
          <iframe 
            src={`https://turbowarp.org/embed?project_url=${encodeURIComponent(projectData.content)}`}
            width="100%" 
            height="100%" 
            allowtransparency="true" 
            frameBorder="0" 
            scrolling="no" 
            allowFullScreen
          />
        )
      case 'Web':
        return (
          <iframe 
            src={projectData.content}
            style={{ width: '100%', height: '100%', border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )
      default:
        return null
    }
  }

  const renderFullscreenContent = () => {
    if (isFullscreenMedia && projectData.type === 'Пост' && Array.isArray(projectData.content) && projectData.content.length > 0) {
      const currentMedia = projectData.content[fullscreenMediaIndex]
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <img 
            src={currentMedia} 
            alt="media" 
            style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.6)',
            padding: '8px 16px',
            borderRadius: '20px'
          }}>
            <button 
              onClick={() => setFullscreenMediaIndex(prev => prev > 0 ? prev - 1 : projectData.content.length - 1)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
            >
              ◀
            </button>
            <span style={{ color: '#fff' }}>
              {fullscreenMediaIndex + 1} / {projectData.content.length}
            </span>
            <button 
              onClick={() => setFullscreenMediaIndex(prev => prev < projectData.content.length - 1 ? prev + 1 : 0)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
            >
              ▶
            </button>
          </div>
        </div>
      )
    }

    switch (projectData.type) {
      case 'Пост':
        return (
          <img 
            src={projectData.imageUrl} 
            alt={projectData.title} 
            style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }} 
          />
        )
      case 'Видео':
        return (
          <video controls autoPlay style={{ width: '100%', height: '90vh', objectFit: 'contain' }}>
            <source src={projectData.content} />
          </video>
        )
      case 'Scratch':
        return (
          <iframe 
            src={`https://turbowarp.org/embed?project_url=${encodeURIComponent(projectData.content)}`}
            style={{ width: '100%', height: '90vh', border: 'none' }}
            allowtransparency="true" 
            frameBorder="0" 
            scrolling="no" 
            allowFullScreen
          />
        )
      case 'Web':
        return (
          <iframe 
            src={projectData.content}
            style={{ width: '100%', height: '90vh', border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="PageProject">
        <div className="PageCard">
          {renderCardContent()}
          <button className="fullscreen-btn" onClick={openFullscreen}>
            🔍
          </button>
        </div>

        <div className="PageCardInfo">
          <div className="PCI-type">{projectData.type}</div>
          
          <div className="PCI-profile">
            <Link to={`/user?id=${projectData.authorId}`}>
              <img src={`${config.STATIC_LOCATION}/emptyprofile.png`} alt="profile" className="JustProfile" style={{ borderRadius: '36px' }} />
              <span style={{ verticalAlign: 'middle' }}>{projectData.author}</span>
            </Link>
          </div>
          
          <div className="PCI-something">
            {projectData.views}👁‍ {projectData.likes}👍 {projectData.commentsCount}💬
          </div>
          
          <div className="PCI-name">
            <h1>{projectData.title}</h1>
          </div>
          
          <div className="PCI-description">
            <Linkify>{projectData.description}</Linkify>
          </div>
          
          <div className="PCI-likebutton">
            <button onClick={toggleProjectLike}>
              <img 
                src={projectData.isLiked ? `${config.STATIC_LOCATION}/likebutton_pressed.png` : `${config.STATIC_LOCATION}/likebutton.png`} 
                alt="like" 
              />
            </button>
          </div>

          {projectData.isOwner && (
            <div className="PCI-editbutton">
              <button onClick={handleEditClick} className="edit-btn">
                ✏️ Изменить проект
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Редактировать проект</h2>
              <button className="modal-close" onClick={() => setIsEditing(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Название проекта</label>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  rows={4}
                  maxLength={500}
                />
              </div>

              <div className="form-group">
                <label>Обложка проекта (URL)</label>
                <div className="url-import-section">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Вставьте ссылку на изображение..."
                    style={{ width: '70%', marginRight: '10px' }}
                  />
                  <button onClick={() => handleUrlImport('imageUrl')} className="btn-import">
                    Установить
                  </button>
                </div>
                {editData.imageUrl && (
                  <img 
                    src={editData.imageUrl} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px', objectFit: 'contain' }}
                  />
                )}
              </div>

              {projectData.type === 'Пост' && (
                <div className="form-group">
                  <label>Медиа файлы (до 10 шт) - PNG, JPG, GIF, WEBP</label>
                  <div className="url-import-section">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Вставьте ссылку на медиа..."
                      style={{ width: '70%', marginRight: '10px' }}
                    />
                    <button onClick={() => handleUrlImport('media')} className="btn-import">
                      Добавить
                    </button>
                  </div>
                  {Array.isArray(editData.content) && editData.content.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                      {editData.content.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                          <img 
                            src={url} 
                            alt={`media-${idx}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <button 
                            onClick={() => {
                              setEditData(prev => ({
                                ...prev,
                                content: prev.content.filter((_, i) => i !== idx)
                              }))
                            }}
                            style={{
                              position: 'absolute',
                              top: '-5px',
                              right: '-5px',
                              background: 'red',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    {Array.isArray(editData.content) ? editData.content.length : 0}/10 медиа файлов
                  </div>
                </div>
              )}

              {projectData.type !== 'Пост' && projectData.type !== 'Web' && (
                <div className="form-group">
                  <label>
                    {projectData.type === 'Scratch' && 'Ссылка на .sb3 файл'}
                    {projectData.type === 'Видео' && 'Ссылка на видео'}
                  </label>
                  <div className="url-import-section">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Вставьте ссылку..."
                      style={{ width: '70%', marginRight: '10px' }}
                    />
                    <button onClick={() => handleUrlImport('content')} className="btn-import">
                      Импорт
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    {projectData.type === 'Scratch' && 'Поддерживаются .sb3 файлы'}
                    {projectData.type === 'Видео' && 'Поддерживаются: mp4, webm, ogg, mov, avi'}
                  </div>
                </div>
              )}

              {projectData.type === 'Web' && (
                <div className="form-group">
                  <label>Ссылка на сайт</label>
                  <input
                    type="text"
                    name="content"
                    value={editData.content}
                    onChange={handleEditChange}
                    placeholder="https://..."
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Текущий контент:</label>
                <div className="current-content">
                  {projectData.type === 'Пост' ? (
                    <span>Медиа: {Array.isArray(editData.content) ? editData.content.length : 0} файлов</span>
                  ) : projectData.type === 'Scratch' ? (
                    <span>.sb3 файл по ссылке</span>
                  ) : projectData.type === 'Видео' ? (
                    <span>Видео по ссылке</span>
                  ) : projectData.type === 'Web' ? (
                    <span>{editData.content || 'Не указан'}</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>Отмена</button>
              <button className="btn-create" onClick={handleSaveEdit}>Сохранить</button>
            </div>
            <div className="modal-footer">
              <button className="btn-create" style={{background:'red'}} onClick={deleteProject}>Удалить Проект</button>
            </div>
          </div>
        </div>
      )}

      {(isFullscreen || isFullscreenMedia) && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="fullscreen-close" onClick={closeFullscreen}>×</button>
            {renderFullscreenContent()}
          </div>
        </div>
      )}

      <div className="CommentPage">
        <div>
          <p>Комментарии:</p>
          
          <div className="TextInput">
            <input 
              type="text" 
              placeholder="Напишите комментарий..." 
              value={mainInput}
              onChange={(e) => setMainInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMainComment()}
            />
            <button className="sendCommentBtn" onClick={addMainComment}>Отправить</button>
          </div>
          
          <div className="commentsList">
            {commentsData.map(comment => (
              <div key={comment.id} className="commentItem">
                <div className="commentHeader">
                  <Link to={`/user?id=${comment.authorId}`} className="commentAuthor">
                    <img src={`${config.STATIC_LOCATION}/emptyprofile.png`} alt="profile" className="commentAvatar" style={{ borderRadius: '50%' }} />
                    <span>{comment.author}</span>
                  </Link>
                  <span className="commentDate">{comment.date}</span>
                </div>
                
                <div className="commentText">{comment.text}</div>
                
                <div className="commentFooter">
                  <button className="replyBtn" onClick={() => showReplyForm(comment.id)}>Ответить</button>
                  {comment.replies.length > 0 && (
                    <button className="collapseBtn" onClick={() => toggleReplies(comment.id)}>
                      {collapsedReplies[comment.id] ? `Показать ответы (${comment.replies.length})` : `Скрыть ответы (${comment.replies.length})`}
                    </button>
                  )}
                </div>
                
                {showReplyForms[comment.id] && (
                  <div className="replyForm">
                    <input 
                      type="text" 
                      placeholder="Написать ответ..." 
                      value={replyInputs[comment.id] || ''}
                      onChange={(e) => setReplyInputs({
                        ...replyInputs,
                        [comment.id]: e.target.value
                      })}
                      onKeyPress={(e) => e.key === 'Enter' && addReply(comment.id)}
                    />
                    <button onClick={() => addReply(comment.id)}>Отправить</button>
                    <button className="cancelReplyBtn" onClick={() => showReplyForm(comment.id)}>Отмена</button>
                  </div>
                )}
                
                {comment.replies.length > 0 && !collapsedReplies[comment.id] && (
                  <div className="childComments">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="childComment">
                        <div className="commentHeader">
                          <Link to={`/user?id=${reply.authorId}`} className="commentAuthor">
                            <img src={`${config.STATIC_LOCATION}/emptyprofile.png`} alt="profile" className="commentAvatar" style={{ borderRadius: '50%' }} />
                            <span>{reply.author}</span>
                          </Link>
                          <span className="commentDate">{reply.date}</span>
                        </div>
                        <div className="commentText">{reply.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}