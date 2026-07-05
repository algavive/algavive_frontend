import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import * as config from '../config'
import { useGoogleAuth } from '../components/GoogleAuth'
import user from '../components/Profile'

export default function Settings(){
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const turnstileRef = useRef<TurnstileInstance | null>(null)
  const [username, setUsername] = useState('')

  const [adminUserId, setAdminUserId] = useState('')
  const [adminIcon, setAdminIcon] = useState('')
  const [adminTitle, setAdminTitle] = useState('')
  const [adminBanDuration, setAdminBanDuration] = useState('')
  const [adminRole, setAdminRole] = useState('none')
  const [adminActionLoading, setAdminActionLoading] = useState(false)
  const [adminLogs, setAdminLogs] = useState<any[]>([])
  const [logPage, setLogPage] = useState(1)
  const [logTotalPages, setLogTotalPages] = useState(1)
  const [logTotal, setLogTotal] = useState(0)
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  const { buttonRef } = useGoogleAuth(
    async (userData) => {
      try {
        setIsLinking(true)
        setError('')
        setSuccess('')

        const turnstileToken = turnstileRef.current?.getResponse()
        if (!turnstileToken) {
          setError('Пожалуйста, подтвердите, что вы не робот')
          setIsLinking(false)
          return
        }

        const response = await fetch(`${config.BACKEND_URL}/api/link-google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            googleToken: userData.token,
            turnstileToken: turnstileToken
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setSuccess('Google аккаунт успешно привязан! Страница обновится...')
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          setError(data.error || 'Ошибка привязки Google')
          turnstileRef.current?.reset()
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка привязки Google')
        turnstileRef.current?.reset()
      } finally {
        setIsLinking(false)
      }
    },
    (errorMessage) => {
      setError(errorMessage)
    }
  )

  const logout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        window.location.href = '/entry'
      } else {
        console.error('Logout failed')
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const ChangeName = async () => {
    if (!username.trim()) {
      setError('Введите новый юзернейм')
      return
    }
    setError('')
    setSuccess('')

    const response = await fetch(`${config.BACKEND_URL}/api/change/username`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim() }),
      credentials: 'include'
    })

    const data = await response.json()

    if (response.ok) {
      setSuccess('Юзернейм изменён!')
      setTimeout(() => window.location.reload(), 1500)
    } else {
      setError(data.error || 'Ошибка')
    }
  }

  const fetchAdminLogs = async (page: number) => {
    if (!user.admin || user.admin < 2) return
    setIsLoadingLogs(true)
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/admin/logs?page=${page}&limit=20`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        setAdminLogs(data.logs || [])
        setLogPage(data.page)
        setLogTotalPages(data.totalPages)
        setLogTotal(data.total)
      }
    } catch (error) {
      console.error('Ошибка загрузки логов', error)
    } finally {
      setIsLoadingLogs(false)
    }
  }

  useEffect(() => {
    if (user.admin && user.admin >= 2) {
      fetchAdminLogs(1)
    }
  }, [])

  const handleAdminAction = async () => {
    if (!adminUserId.trim()) {
      setError('Введите ID пользователя')
      return
    }
    const targetId = parseInt(adminUserId)
    if (isNaN(targetId)) {
      setError('Неверный ID')
      return
    }

    setAdminActionLoading(true)
    setError('')
    setSuccess('')

    let action = ''
    let value = ''

    if (adminRole === 'moderator') {
      action = 'set_role'
      value = '1'
    } else if (adminRole === 'admin') {
      action = 'set_role'
      value = '2'
    } else if (adminRole === 'deputy-admin') {
      action = 'set_role'
      value = '3'
    } else if (adminRole === 'remove') {
      action = 'remove_role'
      value = ''
    } else if (adminIcon.trim()) {
      action = 'set_icon'
      value = adminIcon.trim()
    } else if (adminTitle.trim()) {
      action = 'set_title'
      value = adminTitle.trim()
    } else if (adminBanDuration) {
      if (adminBanDuration === 'never') {
        action = 'unban'
        value = ''
      } else {
        action = 'ban'
        value = adminBanDuration
      }
    } else {
      setError('Выберите действие или заполните поля')
      setAdminActionLoading(false)
      return
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/admin/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action,
          targetUserId: targetId,
          value
        })
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess('Действие выполнено')
        setAdminUserId('')
        setAdminIcon('')
        setAdminTitle('')
        setAdminBanDuration('')
        setAdminRole('none')
        fetchAdminLogs(logPage)
      } else {
        setError(data.error || 'Ошибка выполнения действия')
      }
    } catch (err) {
      setError('Ошибка сети')
    } finally {
      setAdminActionLoading(false)
    }
  }

  const goToLogPage = (page: number) => {
    if (page < 1 || page > logTotalPages) return
    fetchAdminLogs(page)
  }

  return (
    <>
    <div className="settings-page">
      <div>
      <h1>Настройки аккаунта</h1>

       {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
    <h2>Юзернейм:</h2>
      <input 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
     />
      <button onClick={ChangeName}>Поставить</button>
      
      <div className="settings-section">
        <h2>Google аккаунт</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          {user.hasGoogle 
            ? 'У вас уже привязан гугл аккаунт. Нажмите кнопку, чтобы сменить владельца.' 
            : 'Можно привязать гугл аккаунт, чтобы иметь возможность входить без пароля и обезопасить аккаунт.'}
        </p>
        
        <Turnstile
          ref={turnstileRef}
          siteKey={config.SITEKEY_TURNSTILE}
          onError={() => setError('Ошибка загрузки капчи')}
        />
        
        <div style={{ marginTop: '15px' }}>
          <div ref={buttonRef} style={{width: '300px'}}></div>
          {isLinking && <span style={{ marginLeft: '10px' }}>Обработка...</span>}
        </div>
      </div>

      <div className="settings-section" style={{ marginTop: '30px' }}>
        <h2>Выход из аккаунта</h2>
        <button 
          onClick={logout} 
          disabled={isLoggingOut}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            opacity: isLoggingOut ? 0.7 : 1
          }}
        >
          {isLoggingOut ? 'Выход...' : 'Выйти'}
        </button>
      </div>
    </div>

    {user.admin && user.admin >= 2 && (
    <div className="Admin-Panel">
      <div className="Admin-Panel-Window">
        <h1>Админ Панель</h1>
        <p>id пользователя:</p>
        <input type="text" value={adminUserId} onChange={e => setAdminUserId(e.target.value)} />
        <p>Картинка иконки для пользователя(типо селебрити или UserIcon):</p>
        <input type="text" value={adminIcon} onChange={e => setAdminIcon(e.target.value)} />
        <p>Подпись пользователя(UserTitle)</p>
        <input type="text" value={adminTitle} onChange={e => setAdminTitle(e.target.value)} />
        <p>Длительность бана:</p>
        <input type="text" value={adminBanDuration} onChange={e => setAdminBanDuration(e.target.value)} placeholder="5h, 7d, always, never" />
        <h5>он по умолчанию, считает по дням(5h, это час), always-навсегда, never-разбанить</h5>
        <p>Права администраторов:</p>
        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="remove"
              checked={adminRole === 'remove'}
              onChange={() => setAdminRole('remove')}
            />
            Снять админ права
          </label>
          <h1/>
          <label>
            <input
              type="radio"
              name="role"
              value="moderator"
              checked={adminRole === 'moderator'}
              onChange={() => setAdminRole('moderator')}
            />
            Модератор
          </label>
          <h1/>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={adminRole === 'admin'}
              onChange={() => setAdminRole('admin')}
            />
            Админ
          </label>
          <h1/>
          <label>
            <input
              type="radio"
              name="role"
              value="deputy-admin"
              checked={adminRole === 'deputy-admin'}
              onChange={() => setAdminRole('deputy-admin')}
            />
            Вице-Админ
          </label>
          <h1/>
        </div>
        <button onClick={handleAdminAction} disabled={adminActionLoading} style={{backgroundColor:'#efefef', width: '200px'}}><p style={{fontSize:'24px'}}>{adminActionLoading ? '...' : 'OK'}</p></button>
      </div>
    </div>
    )}
    {user.admin && user.admin >= 2 && (
      <div className="Admin-Logs">
        <div className="Admin-Logs-Header">
          <div style={{backgroundColor: '#efefef'}}>
            <h1>Админ логи</h1>
            <pre>
              {isLoadingLogs ? 'Загрузка...' : adminLogs.map(log => `${log.created_at} > ${log.content}`).join('\n')}
            </pre>
            <button 
              disabled={logPage <= 1}
              onClick={() => goToLogPage(1)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                opacity: logPage <= 1 ? 0.5 : 1,
                cursor: logPage <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              &lt;&lt;
            </button>

            <button 
              disabled={logPage <= 1}
              onClick={() => goToLogPage(logPage - 1)}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                opacity: logPage <= 1 ? 0.5 : 1,
                cursor: logPage <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Назад
            </button>
            <span>Страница {logPage} из {logTotalPages} ({logTotal} строк)</span>
            <button 
              disabled={logPage >= logTotalPages}
              onClick={() => goToLogPage(logPage + 1)}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                opacity: logPage >= logTotalPages ? 0.5 : 1,
                cursor: logPage >= logTotalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Вперед →
            </button>

            <button 
              disabled={logPage >= logTotalPages}
              onClick={() => goToLogPage(logTotalPages)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                opacity: logPage >= logTotalPages ? 0.5 : 1,
                cursor: logPage >= logTotalPages ? 'not-allowed' : 'pointer'
              }}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
    </>
  )
}