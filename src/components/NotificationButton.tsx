import { useState, useRef, useEffect } from 'react'
import Notifications from '../types'


const notifications: Notifications = [
  { id: 1, type: 'like', action: 'Ваш проект "Эмулятор NES" кто-то лайкнул', time: '2026-07-03 15:56:57', redirectUrl: '#' },
  { id: 2, type: 'comment', action: 'Ваш проект "Эмулятор NES" кто-то прокоментировал', time: '2026-07-03 15:56:57', redirectUrl: '#' },
  { id: 3, type: 'reply', action: 'Skin228 ответил на ваш комментарий под проектом "Эмулятор NES"', time: '2026-07-03 15:56:57', redirectUrl: '#' },
]


let isDev: boolean = true;

const getIcon = (type: string): string => {
  switch(type) {
    case 'like': return '👍'
    case 'comment': return '💬'
    case 'reply': return '↩️'
    case 'admin': return '👥'
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
            { !isDev ? (
              <>
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
                      {n.action}
                    </div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              ))
            )} </> ) : (<h3>Уведомление в стадии разработки</h3>)
          }
          </div>
        </div>
      )}
    </div>
  )
}

