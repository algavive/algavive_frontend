import { useState, useRef, FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import * as config from '../config';
import { useGoogleAuth } from '../components/GoogleAuth';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationMode, setRegistrationMode] = useState<'local' | 'google'>('local');
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { buttonRef } = useGoogleAuth(
    async (userData) => {
      try {
        if (registrationMode !== 'google') {
          setError('Выберите "Регистрация с Google"');
          return;
        }

        const formData = new FormData(formRef.current!);
        const login = formData.get('login') as string;
        const pass = formData.get('pass') as string;

        if (!login || !pass) {
          setError('Введите логин и пароль');
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
            mode: 'register',
            login: login
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Регистрация с Google успешна! Перенаправление...');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          setError(data.error || 'Ошибка регистрации с Google');
          turnstileRef.current?.reset();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка регистрации через Google');
        turnstileRef.current?.reset();
      }
    },
    (errorMessage) => {
      setError(errorMessage);
    }
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registrationMode === 'google') {
      setError('Используйте кнопку Google для регистрации');
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
      const response = await fetch(`${config.BACKEND_URL}/api/register`, {
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
        setSuccess('Регистрация успешна! Перенаправление...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(data.error || 'Ошибка регистрации');
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
        <h1>Регистрация</h1>

        <div className="registration-mode">
          <label>
            <input
              type="radio"
              value="local"
              checked={registrationMode === 'local'}
              onChange={() => setRegistrationMode('local')}
            />
            Обычная регистрация
          </label>

          <label>
            <input
              type="radio"
              value="google"
              checked={registrationMode === 'google'}
              onChange={() => setRegistrationMode('google')}
            />
            Связать с Google аккаунтом
          </label>
        </div>

        <h3>Введите логин:</h3>
        <input type="text" name="login" required disabled={isLoading} />

        <h3>Введите пароль:</h3>
        <input type="password" name="pass" required disabled={isLoading} />

        <Turnstile
          ref={turnstileRef}
          siteKey={config.SITEKEY_TURNSTILE}
          onError={() => setError('Ошибка загрузки капчи')}
        />

        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}

        {registrationMode === 'local' && (
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
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        )}

        {registrationMode === 'google' && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              Нажмите кнопку для регистрации с Google
            </p>
            <div ref={buttonRef}></div>
          </div>
        )}
      </form>
    </div>
  );
}