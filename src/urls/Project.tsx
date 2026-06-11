import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import * as config from '../config'
import Linkify from 'linkify-react';

export default function Project() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  
  const projectData = {
    title: "Мэднесс комбат",
    type: "Пост",
    author: "GamerDev12672",
    authorId: 8273983,
    views: 3434,
    likes: 4545645,
    commentsCount: 456345654,
    description: `Добро пожаловать в мэднесс комбат!\n\nЕсли хотите поиграть то переходите по ссылке https://madness.com`,
    coverImage: `${config.STATIC_LOCATION}/cover.png`
  }

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
        }
      ]
    },
    {
      id: 3,
      author: "CoolPlayer",
      authorId: 1234567,
      text: "Когда будет обновление?",
      date: "2024-01-16",
      replies: []
    }
  ])

  const [mainInput, setMainInput] = useState('')
  const [replyInputs, setReplyInputs] = useState({})
  const [showReplyForms, setShowReplyForms] = useState({})

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
    
    setCommentsData([...commentsData, newComment])
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
          replies: [...comment.replies, newReply]
        }
      }
      return comment
    })
    
    setCommentsData(updatedComments)
    setReplyInputs({
      ...replyInputs,
      [parentId]: ''
    })
    setShowReplyForms({
      ...showReplyForms,
      [parentId]: false
    })
  }
  
  return (
    <>
      <div className="PageProject">
        <div className="PageCard">
          <img src={projectData.coverImage} alt={projectData.title} />
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
            <button><img src={`${config.STATIC_LOCATION}/likebutton.png`} alt="like" /></button>
          </div>
        </div>
      </div>

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
                
                {comment.replies.length > 0 && (
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