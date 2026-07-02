import { useState, useRef, useEffect } from 'react'
import Notifications from '../types'

const notifications: Notifications = [
  { id: 1, type: 'like', user: 'Анна', action: 'лайкнула ваш проект', target: 'Эмулятор NES', time: '5 мин назад', redirectUrl: '#' },
  { id: 2, type: 'comment', user: 'Дмитрий', action: 'прокомментировал', target: '3D движок', time: 'час назад', redirectUrl: '#' },
  { id: 3, type: 'reply', user: 'Максим', action: 'ответил на комментарий', target: 'в проекте Эмулятор', time: 'вчера', redirectUrl: '#' },
]

const getIcon = (type: string): string => {
  switch(type) {
    case 'like': return '👍'
    case 'comment': return '💬'
    case 'friend': return '👥'
    case 'reply': return '↩️'
    default: return '📢'
  }
}

export const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (redirectUrl: string) => {
    window.location.href = redirectUrl
    setIsOpen(false)
  }

  return (
    <div className="notification-button-wrapper" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <img src="/push.png" alt='notifications' className="h-profile"/>
      </button>
      
      {isOpen && (
        <div className="notification-menu">
          <div className="notif-header">
            <span>Уведомления</span>
            <span className="notif-count">{notifications.length}</span>
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">Нет уведомлений</div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  className="notif-item"
                  onClick={() => handleNotificationClick(n.redirectUrl)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="notif-icon">{getIcon(n.type)}</div>
                  <div className="notif-content">
                    <div className="notif-text">
                      <strong>{n.user}</strong> {n.action}
                      {n.target && <span className="notif-target"> «{n.target}»</span>}
                    </div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}