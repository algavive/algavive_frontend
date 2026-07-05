import { useSearchParams, Link } from 'react-router-dom'
import { useState, ChangeEvent, useEffect } from 'react'
import * as config from '../config'
import Linkify from 'linkify-react'
import { PageProject, Comments, Reply } from '../types'
import user from '../components/Profile'

type CommentType = Comments

export default function Project() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [mediaIndex, setMediaIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFullscreenMedia, setIsFullscreenMedia] = useState(false)
  const [fullscreenMediaIndex, setFullscreenMediaIndex] = useState(0)
  const [urlInput, setUrlInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showWebWarning, setShowWebWarning] = useState(true)

  const [commentPage, setCommentPage] = useState(1)
  const [commentTotalPages, setCommentTotalPages] = useState(1)
  const [commentTotal, setCommentTotal] = useState(0)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const [replyPages, setReplyPages] = useState<Record<number, number>>({})
  const [replyData, setReplyData] = useState<Record<number, { replies: Reply[], total: number, totalPages: number }>>({})


  const [projectData, setProjectData] = useState<PageProject>({
    id: Number(id) || 0,
    title: '',
    type: '',
    author: '',
    authorId: 0,
    views: 0,
    likes: 0,
    isLiked: false,
    comments: 0,
    description: '',
    imageUrl: `${config.STATIC_LOCATION}/cover.png`,
    content: '',
    isOwner: false,
    isPublished: false
  })

  const [editData, setEditData] = useState<{
    title: string
    description: string
    imageUrl: string
    content: string | string[]
  }>({
    title: '',
    description: '',
    imageUrl: '',
    content: ''
  })

  const [commentsData, setCommentsData] = useState<CommentType[]>([])
  const [mainInput, setMainInput] = useState('')
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({})
  const [showReplyForms, setShowReplyForms] = useState<Record<number, boolean>>({})
  const [collapsedReplies, setCollapsedReplies] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (!id) return
    fetchProject()
    fetchComments(1)
  }, [id])

const fetchProject = async () => {
  setIsLoading(true)
  try {
    const response = await fetch(`${config.BACKEND_URL}/api/project/${id}`, {
      credentials: 'include'
    })
    const data = await response.json()
    if (response.ok) {
      let content = data.project.content || ''
      if (data.project.type === 'Пост') {
        if (typeof content === 'string') {
          try {
            const parsed = JSON.parse(content)
            if (Array.isArray(parsed)) {
              content = parsed
            } else {
              content = content ? [content] : []
            }
          } catch {
            content = content ? [content] : []
          }
        } else if (!Array.isArray(content)) {
          content = content ? [content] : []
        }
      }
      setProjectData({
        id: data.project.id,
        title: data.project.title,
        type: data.project.type,
        author: data.project.author || 'Неизвестно',
        authorId: data.project.user_id,
        views: data.project.views || 0,
        likes: data.project.likes || 0,
        isLiked: data.project.isLiked || false,
        comments: data.project.comments || 0,
        description: data.project.description || '',
        imageUrl: data.project.imageUrl || `${config.STATIC_LOCATION}/cover.png`,
        content: content,
        isOwner: data.project.isOwner || false,
        authorProfile: data.project.authorProfile || null,
        isPublished: data.project.is_published || false
      })
      setEditData({
        title: data.project.title,
        description: data.project.description || '',
        imageUrl: data.project.imageUrl || '',
        content: content
      })
    }
  } catch (error) {
    console.error('Ошибка загрузки проекта', error)
  } finally {
    setIsLoading(false)
  }
}

const fetchComments = async (pageNum: number = 1) => {
  setIsLoadingComments(true)
  try {
    const response = await fetch(
      `${config.BACKEND_URL}/api/project/${id}/comments?page=${pageNum}&limit=20&replyLimit=5`,
      { credentials: 'include' }
    )
    const data = await response.json()
    if (response.ok) {
      const comments: CommentType[] = (data.comments || []).map((c: any) => ({
        id: c.id,
        author: c.author,
        authorId: c.user_id,
        content: c.content,
        date: c.created_at,
        rankIcon: c.authorIcon || null,
        rankTitle: c.authorTitle || null,
        authorProfile: c.authorProfile || `${config.STATIC_LOCATION}/emptyprofile.png`,
        replies: (c.replies || []).map((r: any) => ({
          id: r.id,
          author: r.author,
          authorId: r.user_id,
          content: r.content,
          date: r.created_at,
          rankIcon: r.authorIcon || null,
          rankTitle: r.authorTitle || null,
          authorProfile: r.authorProfile || `${config.STATIC_LOCATION}/emptyprofile.png`,
          rankIcon: c.rankIcon || null,
          rankTitle: c.rankTitle || null,
        })),
        totalReplies: c.totalReplies || 0
      }))
      setCommentsData(comments)
      setCommentPage(data.page)
      setCommentTotalPages(data.totalPages)
      setCommentTotal(data.total)
    }
  } catch (error) {
    console.error('Ошибка загрузки комментариев', error)
  } finally {
    setIsLoadingComments(false)
  }
}

const fetchReplies = async (commentId: number, page: number = 1) => {
  try {
    const response = await fetch(
      `${config.BACKEND_URL}/api/comments/${commentId}/replies?page=${page}&limit=5`,
      { credentials: 'include' }
    )
    const data = await response.json()
    if (response.ok) {
      const replies = data.replies.map((r: any) => ({
        id: r.id,
        author: r.author,
        authorId: r.user_id,
        content: r.content,
        date: r.created_at,
        rankIcon: r.authorIcon || null,
        rankTitle: r.authorTitle || null,
        authorProfile: r.authorProfile || `${config.STATIC_LOCATION}/emptyprofile.png`
      }))
      setReplyData(prev => ({
        ...prev,
        [commentId]: {
          replies,
          total: data.total,
          totalPages: data.totalPages
        }
      }))
      setReplyPages(prev => ({ ...prev, [commentId]: page }))
    }
  } catch (error) {
    console.error('Ошибка загрузки ответов', error)
  }
}

const loadMoreComments = () => {
  if (commentPage < commentTotalPages) {
    fetchComments(commentPage + 1)
  }
}

  const toggleProjectLike = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/project/${projectData.id}/like`, {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        setProjectData(prev => ({
          ...prev,
          isLiked: data.liked,
          likes: data.liked ? prev.likes + 1 : prev.likes - 1
        }))
      }
    } catch (error) {
      console.error('Ошибка лайка', error)
    }
  }

  const deleteComment = async (commentId: number) => {
    const comment = commentsData.find(c => c.id === commentId)
    if (!comment) return

    if (!user.admin && user.name !== comment.author) {
      alert('Вы можете удалять только свои комментарии')
      return
    }
    if (!confirm('Удалить комментарий?')) return

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        setCommentsData(prev => prev.filter(c => c.id !== commentId))
      }
    } catch (error) {
      console.error('Ошибка удаления комментария', error)
    }
  }

  const deleteReply = async (commentId: number, replyId: number) => {
    const comment = commentsData.find(c => c.id === commentId)
    if (!comment) return
    const replies = comment.replies || []
    const reply = replies.find(r => r.id === replyId)
    if (!reply) return

    if (!user.admin && user.name !== reply.author) {
      alert('Вы можете удалять только свои ответы')
      return
    }
    if (!confirm('Удалить ответ?')) return

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/comments/${replyId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        setCommentsData(prev =>
          prev.map(c => {
            if (c.id === commentId) {
              return { ...c, replies: (c.replies || []).filter(r => r.id !== replyId) }
            }
            return c
          })
        )
      }
    } catch (error) {
      console.error('Ошибка удаления ответа', error)
    }
  }

  const addMainComment = async () => {
    if (mainInput.trim() === '') return
    if (!user.logined) {
      alert('Вы не зашли в аккаунт')
      return
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/project/${projectData.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: mainInput })
      })
      const data = await response.json()
      if (response.ok) {
        const newComment: CommentType = {
          id: data.comment.id,
          author: data.comment.author,
          authorId: data.comment.user_id,
          content: data.comment.content,
          date: data.comment.created_at,
          rankIcon: data.comment.rankIcon || null,
          rankTitle: data.comment.rankTitle || null,
          authorProfile: data.comment.authorProfile || `${config.STATIC_LOCATION}/emptyprofile.png`,
          replies: []
        }
        setCommentsData(prev => [newComment, ...prev])
        setMainInput('')
      }
    } catch (error) {
      console.error('Ошибка отправки комментария', error)
    }
  }

  const showReplyForm = (commentId: number) => {
    setShowReplyForms({
      ...showReplyForms,
      [commentId]: !showReplyForms[commentId]
    })
    setReplyInputs({
      ...replyInputs,
      [commentId]: ''
    })
  }

  const addReply = async (parentId: number) => {
    const replyText = replyInputs[parentId]
    if (!replyText || replyText.trim() === '') return
    if (!user.logined) {
      alert('Вы не зашли в аккаунт')
      return
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/comments/${parentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: replyText })
      })
      const data = await response.json()
      if (response.ok) {
        setCommentsData(prev =>
          prev.map(c => {
            if (c.id === parentId) {
              const newReply: Reply = {
                id: data.reply.id,
                author: data.reply.author,
                authorId: data.reply.user_id,
                content: data.reply.content,
                date: data.reply.created_at,
                rankIcon: data.reply.rankIcon || null,
                rankTitle: data.reply.rankTitle || null,
                authorProfile: data.reply.authorProfile || `${config.STATIC_LOCATION}/emptyprofile.png`
              }
              return { ...c, replies: [...(c.replies || []), newReply] }
            }
            return c
          })
        )
        setReplyInputs({ ...replyInputs, [parentId]: '' })
        setShowReplyForms({ ...showReplyForms, [parentId]: false })
        if (collapsedReplies[parentId]) {
          setCollapsedReplies({ ...collapsedReplies, [parentId]: false })
        }
      }
    } catch (error) {
      console.error('Ошибка отправки ответа', error)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setEditData({
      title: projectData.title,
      description: projectData.description,
      imageUrl: projectData.imageUrl || '',
      content: projectData.content
    })
    setUrlInput('')
  }

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUrlImport = (type: 'imageUrl' | 'content' | 'media') => {
    if (!urlInput.trim()) return
    const url = urlInput.trim()
    const extension = url.split('.').pop()?.toLowerCase() || ''
      //&& ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)
    //['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff']
    //&& extension === 'sb3'
    if (type === 'imageUrl') {
      setEditData(prev => ({ ...prev, imageUrl: url }))
      setUrlInput('')
    } else if (type === 'content') {
      if (projectData.type === 'Scratch') {
        setEditData(prev => ({ ...prev, content: url }))
        setUrlInput('')
      } else if (projectData.type === 'Видео') {
        setEditData(prev => ({ ...prev, content: url }))
        setUrlInput('')
      } else if (projectData.type === 'Web') {
        setEditData(prev => ({ ...prev, content: url }))
        setUrlInput('')
      } else {
        alert('Неверный формат URL для этого типа проекта')
      }
    } else if (type === 'media') {
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
      
    }
  }

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/project/${projectData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: editData.title,
          description: typeof editData.description === 'string' ? editData.description : '',
          content: editData.content,
          imageUrl: editData.imageUrl
        })
      })
      if (response.ok) {
        setProjectData(prev => ({
          ...prev,
          title: editData.title,
          description: typeof editData.description === 'string' ? editData.description : '',
          imageUrl: editData.imageUrl,
          content: Array.isArray(editData.content) ? JSON.stringify(editData.content) : editData.content,
        }))
        setIsEditing(false)
      } else {
        alert(`Ошибка запроса ${response}`)
      }
    } catch (error) {
      alert(`Ошибка сохранения ${error}`)
      console.error('Ошибка сохранения', error)
    }
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

  const deleteProject = async () => {
    if (!user.admin && !projectData.isOwner) {
      alert('У вас нет прав на удаление этого проекта')
      return
    }
    if (!confirm('Удалить проект?')) return

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/project/${projectData.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        window.location.href = '/my-projects'
      }
    } catch (error) {
      console.error('Ошибка удаления', error)
    }
  }

  const handlePublish = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/project/${projectData.id}/publish`, {
        method: 'POST',
        credentials: 'include'
      })
      if (response.ok) {
        alert('Проект опубликован в Зал Славы')
      }
    } catch (error) {
      console.error('Ошибка публикации', error)
    }
  }

  const handlePublishEntertaiment = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/project/${projectData.id}/publish-entertaiment`, {
        method: 'POST',
        credentials: 'include'
      })
      if (response.ok) {
        alert('Проект опубликован в Центр Развлечений')
      }
    } catch (error) {
      console.error('Ошибка публикации', error)
    }
  }

  const removeProject = async () => {
    if (!user.admin) {
      alert('Только администратор может снять проект с публикации')
      return
    }
    if (!confirm('Снять проект с публикации?')) return

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/project/${projectData.id}/unpublish`, {
        method: 'POST',
        credentials: 'include'
      })
      if (response.ok) {
        alert('Проект снят с публикации')
      }
    } catch (error) {
      console.error('Ошибка снятия с публикации', error)
    }
  }



const toggleReplies = (commentId: number) => {
  const isCollapsed = collapsedReplies[commentId]
  setCollapsedReplies({
    ...collapsedReplies,
    [commentId]: !isCollapsed
  })
  if (isCollapsed && !replyData[commentId]) {
    fetchReplies(commentId, 1)
  }
}

const loadAllReplies = async (commentId: number) => {
  try {
    const response = await fetch(
      `${config.BACKEND_URL}/api/comments/${commentId}/replies/all`,
      { credentials: 'include' }
    )
    const data = await response.json()
    if (response.ok) {
      const allReplies = data.replies.map((r: any) => ({
        id: r.id,
        author: r.author,
        authorId: r.user_id,
        content: r.content,
        date: r.created_at,
        rankIcon: r.rankIcon || null,
        rankTitle: r.rankTitle || null,
        authorProfile: r.authorProfile || `${config.STATIC_LOCATION}/emptyprofile.png`
      }))
      setReplyData(prev => ({
        ...prev,
        [commentId]: {
          replies: allReplies,
          total: allReplies.length,
          totalPages: 1
        }
      }))
      setReplyPages(prev => ({ ...prev, [commentId]: 1 }))
    }
  } catch (error) {
    console.error('Ошибка загрузки всех ответов', error)
  }
}

  const renderCardContent = () => {
    switch (projectData.type) {

case 'Пост': {
  const mediaArray = Array.isArray(projectData.content) ? projectData.content : []
  const displayImage = mediaArray.length > 0 ? mediaArray[mediaIndex] : projectData.imageUrl

  const goPrev = () => setMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaArray.length - 1))
  const goNext = () => setMediaIndex((prev) => (prev < mediaArray.length - 1 ? prev + 1 : 0))

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <img
        src={displayImage || undefined}
        alt={projectData.title}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      {mediaArray.length > 1 && (
        <>
          <button
            onClick={goPrev}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '20px',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
            ‹
          </button>
          <button
            onClick={goNext}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '20px',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
            ›
          </button>
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              background: 'rgba(0,0,0,0.5)',
              padding: '4px 10px',
              borderRadius: '12px',
              alignItems: 'center',
              zIndex: 2
            }}
          >
            {mediaArray.map((_, idx) => (
              <span
                key={idx}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: idx === mediaIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s'
                }}
              />
            ))}
            <span style={{ color: '#fff', fontSize: '11px', marginLeft: '4px' }}>
              {mediaIndex + 1}/{mediaArray.length}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
case 'Видео': {
  const videoSrc = typeof projectData.content === 'string' ? projectData.content : ''
  if (!videoSrc) {
    return <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>Видео не загружено</div>
  }
  return (
    <video controls style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
      <source src={videoSrc} />
    </video>
  )
}
      case 'Scratch':
        const scratchUrl = typeof projectData.content === 'string' ? projectData.content : ''
        return (
          <iframe
            src={`https://turbowarp.org/embed?project_url=${encodeURIComponent(scratchUrl)}`}
            width="100%"
            height="100%"
            allowTransparency={true}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
          />
        )
case 'Web': {
  const webUrl = typeof projectData.content === 'string' ? projectData.content : ''
  if (showWebWarning) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff3cd', padding: '20px' }}>
        <p style={{ color: '#856404', marginBottom: '15px', fontSize: '16px' }}>
          ⚠️ Вы переходите на внешний сайт: <br /><a target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{webUrl}</a>
        </p>
        <button
          onClick={() => setShowWebWarning(false)}
          style={{ padding: '10px 30px', background: '#ffc107', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
        >
          Продолжить
        </button>
      </div>
    )
  }
  return (
    <iframe
      src={webUrl}
      style={{ width: '100%', height: '100%', border: 'none' }}
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  )
}
      default:
        return null
    }
  }

  const renderFullscreenContent = () => {
    if (isFullscreenMedia && projectData.type === 'Пост' && Array.isArray(projectData.content) && projectData.content.length > 0) {
      const currentMedia = projectData.content[fullscreenMediaIndex]
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <img
            src={currentMedia}
            alt="media"
            style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }}
          />
          <div
            style={{
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
            }}
          >
            <button
              onClick={() =>
                setFullscreenMediaIndex(prev => (prev > 0 ? prev - 1 : projectData.content.length - 1))
              }
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
            >
              ◀
            </button>
            <span style={{ color: '#fff' }}>
              {fullscreenMediaIndex + 1} / {projectData.content.length}
            </span>
            <button
              onClick={() =>
                setFullscreenMediaIndex(prev => (prev < projectData.content.length - 1 ? prev + 1 : 0))
              }
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
            src={projectData.imageUrl || undefined}
            alt={projectData.title}
            style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
          />
        )
case 'Видео': {
  const videoSrc = typeof projectData.content === 'string' ? projectData.content : ''
  if (!videoSrc) {
    return <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>Видео не загружено</div>
  }
  return (
    <video controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={videoSrc} />
  )
}
      case 'Scratch':
        const scratchUrl = typeof projectData.content === 'string' ? projectData.content : ''
        return (
          <iframe
            src={`https://turbowarp.org/embed?project_url=${encodeURIComponent(scratchUrl)}`}
            style={{ width: '100%', height: '90vh', border: 'none' }}
            allowTransparency={true}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
          />
        )
case 'Web': {
  const webUrl = typeof projectData.content === 'string' ? projectData.content : ''
  if (showWebWarning) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#fff3cd', padding: '20px' }}>
        <p style={{ color: '#856404', marginBottom: '15px', fontSize: '18px' }}>
          ⚠️ Вы переходите на внешний сайт: <br /><a href={webUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{webUrl}</a>
        </p>
        <button
          onClick={() => setShowWebWarning(false)}
          style={{ padding: '10px 30px', background: '#ffc107', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
        >
          Продолжить
        </button>
      </div>
    )
  }
  return (
    <iframe
      src={webUrl}
      style={{ width: '100%', height: '90vh', border: 'none' }}
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  )
}
      default:
        return null
    }
  }

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</div>
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
              <img
                src={projectData.authorProfile ? projectData.authorProfile :`${config.STATIC_LOCATION}/emptyprofile.png`}
                alt="profile"
                className="JustProfile"
                style={{ borderRadius: '36px' }}
              />
              <span style={{ verticalAlign: 'middle' }}>{projectData.author}</span>
            </Link>
          </div>

          <div className="PCI-something">
            {projectData.views}👁‍ {projectData.likes}👍 {projectData.comments}💬
          </div>

          <div className="PCI-name">
            <h1>{projectData.title}</h1>
          </div>

          <div className="PCI-description">
            <Linkify>{projectData.description}</Linkify>
          </div>

          {!projectData.isOwner && (
          <div className="PCI-likebutton">
            <button onClick={toggleProjectLike}>
              <img
                src={
                  projectData.isLiked
                    ? `${config.STATIC_LOCATION}/likebutton_pressed.png`
                    : `${config.STATIC_LOCATION}/likebutton.png`
                }
                alt="like"
              />
            </button>
          </div>
          )}

          {projectData.isOwner && (
            <div className="PCI-editbutton">
              <button onClick={handleEditClick} className="edit-btn">
                ✏️ Изменить проект
              </button>
            </div>
          )}

          {(user.admin || projectData.isOwner) && projectData.isPublished && (
            <div className="PCI-editbutton">
              <button onClick={removeProject} className="edit-btn" style={{ background: 'orange' }}>
                Снять с публикации
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Редактировать проект</h2>
              <button className="modal-close" onClick={() => setIsEditing(false)}>
                ×
              </button>
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
                  maxLength={1024}
                />
              </div>

              <div className="form-group">
                <label>Обложка проекта (URL)</label>
                <div className="url-import-section">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
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
                  <label>Медиа файлы (до 10 шт)</label>
                  <div className="url-import-section">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
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
                                content: Array.isArray(prev.content) ? prev.content.filter((_, i) => i !== idx) : []
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
                      onChange={e => setUrlInput(e.target.value)}
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
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                Отмена
              </button>
              <button className="btn-create" onClick={handleSaveEdit}>
                Сохранить
              </button>
              <button className="btn-publish" onClick={handlePublish}>
                Опубликовать
              </button>
            </div>
            {user.admin && (
            <div style={{ gap: '20px' }}>
              <button className="btn-publish-entertaiment" onClick={handlePublishEntertaiment}>
                Опубликовать в Центр Развлечений
              </button>
            </div>)}
            <div className="modal-footer">
              <button className="btn-create" style={{ background: 'red' }} onClick={deleteProject}>
                Удалить Проект
              </button>
            </div>
          </div>
        </div>
      )}

      {(isFullscreen || isFullscreenMedia) && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <div className="fullscreen-content" onClick={e => e.stopPropagation()}>
            <button className="fullscreen-close" onClick={closeFullscreen}>
              ×
            </button>
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
        onChange={e => setMainInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addMainComment()}
        maxLength={300}
      />
      <button className="sendCommentBtn" onClick={addMainComment}>
        Отправить
      </button>
    </div>

    <div className="commentsList">
      {isLoadingComments && <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка комментариев...</div>}
      {!isLoadingComments && commentsData.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Комментариев пока нет.
        </div>
      ) : (
        commentsData.map(comment => {
          const replies = comment.replies || []
          const hasReplies = replies.length > 0
          const hasHiddenReplies = comment.totalReplies && comment.totalReplies > replies.length
          return (
            <div key={comment.id} className="commentItem">
              <div className="commentHeader">
                <Link to={`/user?id=${comment.authorId}`} className="commentAuthor">
                  <img src={comment.authorProfile} alt="profile" className="commentAvatar" style={{ borderRadius: '50%' }} />
                  <div className="commentAuthorInfo">
                    <div className="commentAuthorNameWrapper">
                      <span className="commentAuthorName">{comment.author}</span>
                      {comment.rankIcon && <img src={comment.rankIcon} alt="rank" style={{ height: '16px', width: '16px', marginLeft: '4px' }} />}
                    </div>
                    {comment.rankTitle && <span className="commentRankTitle" style={{ color: 'purple', fontSize: '11px' }}>{comment.rankTitle}</span>}
                  </div>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="commentDate">{new Date(comment.date + 'Z').toLocaleString()}</span>
                  {(user.admin || user.name === comment.author) && (
                    <button onClick={() => deleteComment(comment.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>✕</button>
                  )}
                </div>
              </div>

              <div className="commentText">{comment.content}</div>

              <div className="commentFooter">
                <button className="replyBtn" onClick={() => showReplyForm(comment.id)}>Ответить</button>
                {hasReplies && (
                  <button className="collapseBtn" onClick={() => toggleReplies(comment.id)}>
                    {collapsedReplies[comment.id] ? `Показать ответы` : `Скрыть ответы (${replies.length})`}
                  </button>
                )}
              </div>

              {showReplyForms[comment.id] && (
                <div className="replyForm">
                  <input type="text" placeholder="Написать ответ..." value={replyInputs[comment.id] || ''} onChange={e => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })} onKeyDown={e => e.key === 'Enter' && addReply(comment.id)} maxLength={300} />
                  <button onClick={() => addReply(comment.id)}>Отправить</button>
                  <button className="cancelReplyBtn" onClick={() => showReplyForm(comment.id)}>Отмена</button>
                </div>
              )}

              {hasReplies && !collapsedReplies[comment.id] && (
                <div className="childComments">
                  {!replyData[comment.id] && (
                    <div style={{ padding: '8px', color: '#999' }}>Загрузка ответов...</div>
                  )}
                  {(replyData[comment.id]?.replies || []).map((reply: Reply) => (
                    <div key={reply.id} className="childComment">
                      <div className="commentHeader">
                        <Link to={`/user?id=${reply.authorId}`} className="commentAuthor">
                          <img src={reply.authorProfile} alt="profile" className="commentAvatar" style={{ borderRadius: '50%' }} />
                          <div className="commentAuthorInfo">
                            <div className="commentAuthorNameWrapper">
                              <span className="commentAuthorName">{reply.author}</span>
                              {reply.rankIcon && <img src={reply.rankIcon} alt="rank" style={{ height: '16px', width: '16px', marginLeft: '4px' }} />}
                            </div>
                            {reply.rankTitle && <span className="commentRankTitle" style={{ color: 'purple', fontSize: '13px' }}>{reply.rankTitle}</span>}
                          </div>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="commentDate">{new Date(reply.date + 'Z').toLocaleString()}</span>
                          {(user.admin || user.name === reply.author) && (
                            <button onClick={() => deleteReply(comment.id, reply.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>✕</button>
                          )}
                        </div>
                      </div>
                      <div className="commentText">{reply.content}</div>
                    </div>
                  ))}
                  {replyData[comment.id] && (
                    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                      <button
                        disabled={replyPages[comment.id] <= 1}
                        onClick={() => fetchReplies(comment.id, 1)}
                        style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: replyPages[comment.id] <= 1 ? 'not-allowed' : 'pointer', opacity: replyPages[comment.id] <= 1 ? 0.5 : 1 }}
                      >
                        &lt;&lt;
                      </button>
                      <button
                        disabled={replyPages[comment.id] <= 1}
                        onClick={() => fetchReplies(comment.id, (replyPages[comment.id] || 1) - 1)}
                        style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: replyPages[comment.id] <= 1 ? 'not-allowed' : 'pointer', opacity: replyPages[comment.id] <= 1 ? 0.5 : 1 }}
                      >
                        ←
                      </button>
                      <span style={{ fontSize: '13px' }}>
                        {replyPages[comment.id] || 1} / {replyData[comment.id]?.totalPages || 1}
                      </span>
                      <button
                        disabled={replyPages[comment.id] >= (replyData[comment.id]?.totalPages || 1)}
                        onClick={() => fetchReplies(comment.id, (replyPages[comment.id] || 1) + 1)}
                        style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: replyPages[comment.id] >= (replyData[comment.id]?.totalPages || 1) ? 'not-allowed' : 'pointer', opacity: replyPages[comment.id] >= (replyData[comment.id]?.totalPages || 1) ? 0.5 : 1 }}
                      >
                        →
                      </button>
                      <button
                        disabled={replyPages[comment.id] >= (replyData[comment.id]?.totalPages || 1)}
                        onClick={() => fetchReplies(comment.id, replyData[comment.id]?.totalPages || 1)}
                        style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: replyPages[comment.id] >= (replyData[comment.id]?.totalPages || 1) ? 'not-allowed' : 'pointer', opacity: replyPages[comment.id] >= (replyData[comment.id]?.totalPages || 1) ? 0.5 : 1 }}
                      >
                        &gt;&gt;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })
      )}

      {!isLoadingComments && commentTotalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '20px 0', marginTop: '10px' }}>
          <button
            disabled={commentPage <= 1}
            onClick={() => fetchComments(1)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: commentPage <= 1 ? 'not-allowed' : 'pointer',
              opacity: commentPage <= 1 ? 0.5 : 1
            }}
          >
            &lt;&lt;
          </button>
          <button
            disabled={commentPage <= 1}
            onClick={() => fetchComments(commentPage - 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: commentPage <= 1 ? 'not-allowed' : 'pointer',
              opacity: commentPage <= 1 ? 0.5 : 1
            }}
          >
            ← Назад
          </button>
          <span style={{ fontSize: '14px', color: '#666' }}>
            Страница {commentPage} из {commentTotalPages} ({commentTotal} комментариев)
          </span>
          <button
            disabled={commentPage >= commentTotalPages}
            onClick={() => fetchComments(commentPage + 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: commentPage >= commentTotalPages ? 'not-allowed' : 'pointer',
              opacity: commentPage >= commentTotalPages ? 0.5 : 1
            }}
          >
            Вперед →
          </button>
          <button
            disabled={commentPage >= commentTotalPages}
            onClick={() => fetchComments(commentTotalPages)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: commentPage >= commentTotalPages ? 'not-allowed' : 'pointer',
              opacity: commentPage >= commentTotalPages ? 0.5 : 1
            }}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  </div>
</div>
    </>
  )
}