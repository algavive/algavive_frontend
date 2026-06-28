import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import ProjectCard from '../components/ProjectCard'
import type { Project } from '../types'
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
  return (
    <div className="settings-page">
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
  )
}