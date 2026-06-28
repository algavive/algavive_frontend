import { useState, useRef, FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import * as config from '../config';
import { useGoogleAuth } from '../components/GoogleAuth';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginMode, setLoginMode] = useState<'local' | 'google'>('local');
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { buttonRef } = useGoogleAuth(
    async (userData) => {
      try {
        if (loginMode !== 'google') {
          setError('Выберите "Вход с Google"');
          return;
        }

        const turnstileToken = turnstileRef.current?.getResponse();
        if (!turnstileToken) {
          setError('Пожалуйста, подтвердите, что вы не робот');
          return;
        }

        const response = await fetch(`${config.BACKEND_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            googleToken: userData.token,
            turnstileToken: turnstileToken,
            mode: 'login'
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Вход успешен! Перенаправление...');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          setError(data.error || 'Ошибка входа через Google');
          turnstileRef.current?.reset();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка входа через Google');
        turnstileRef.current?.reset();
      }
    },
    (errorMessage) => {
      setError(errorMessage);
    }
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginMode === 'google') {
      setError('Используйте кнопку Google для входа');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const token = turnstileRef.current?.getResponse();

    if (!token) {
      setError('Пожалуйста, подтвердите, что вы не робот');
      setIsLoading(false);
      return;
    }

    const login = formData.get('login') as string;
    const pass = formData.get('pass') as string;

    if (!login || !pass) {
      setError('Введите логин и пароль');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          login: login,
          pass: pass,
          turnstileToken: token,
          mode: 'local'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Вход успешен! Перенаправление...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(data.error || 'Ошибка входа');
        turnstileRef.current?.reset();
      }
    } catch (err) {
      setError('Ошибка сети, попробуйте позже');
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Entry">
      <form ref={formRef} onSubmit={handleSubmit}>
        <h1>Вход в аккаунт</h1>

        <div className="login-mode">
          <label>
            <input
              type="radio"
              value="local"
              checked={loginMode === 'local'}
              onChange={() => setLoginMode('local')}
            />
            Обычный вход
          </label>
          <label>
            <input
              type="radio"
              value="google"
              checked={loginMode === 'google'}
              onChange={() => setLoginMode('google')}
            />
            Вход с Google
          </label>
        </div>

        {loginMode === 'local' && (
          <>
            <h3>Введите логин:</h3>
            <input type="text" name="login" required disabled={isLoading} />
            <h3>Введите пароль:</h3>
            <input type="password" name="pass" required disabled={isLoading} />
          </>
        )}

        <Turnstile
          ref={turnstileRef}
          siteKey={config.SITEKEY_TURNSTILE}
          onError={() => setError('Ошибка загрузки капчи')}
        />

        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}

        {loginMode === 'local' && (
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        )}

        {loginMode === 'google' && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              Нажмите кнопку для входа с Google
            </p>
            <div ref={buttonRef}></div>
          </div>
        )}
      </form>
    </div>
  );
}

/*
Это тоже не имеет смысла при демо релизе, так как будет производственный ад с ним

<div className="oauth-divider">
        <span>или</span>
      </div>

      <h1>Восстановление пароля</h1>
      <h3>Работает у аккаунтов с google oauth</h3>
      <Link to="/resetpass">Забыли пароль?</Link>
*/

/*
<h1>Восстановление пароля</h1>
			<h3>Работает с аккаунтами, у кого эмейл и это пока экспериментально</h3>
			<Link to="/resetpass">Забыли пароль?</Link>
*/