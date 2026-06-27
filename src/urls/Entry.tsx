import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import * as config from '../config';
import { useGoogleAuth } from '../components/GoogleAuth';

export default function Entry() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [login, setLogin] = useState('');
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const { buttonRef } = useGoogleAuth(
    async (userData) => {
      try {
        const turnstileToken = turnstileRef.current?.getResponse();

        if (!turnstileToken) {
          setError('Пожалуйста, подтвердите, что вы не робот');
          return;
        }

        if (!login.trim()) {
          setError('Введите логин');
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
          setSuccess('Регистрация через Google успешна! Перенаправление...');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          setError(data.error || 'Ошибка регистрации через Google');
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

  return (
    <div className="Entry">
      <h1>Ты кто?</h1>
      <Link to="/register">
        <img src={`${config.STATIC_LOCATION}/IAmNew.png`} alt="Новый пользователь" />
      </Link>
      <Link to="/login">
        <img src={`${config.STATIC_LOCATION}/IAmAlgavivec.png`} alt="Уже есть аккаунт" />
      </Link>

      <div className="oauth-divider">
        <span>или можете зарегистрироваться по oauth</span>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <h3>Введите логин:</h3>
        <input
          type="text"
          name="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Введите логин для регистрации"
        />

        <Turnstile
          ref={turnstileRef}
          siteKey={config.SITEKEY_TURNSTILE}
          onError={() => setError('Ошибка загрузки капчи')}
        />

        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}

        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            Зарегистрироваться с Google
          </p>
          <div ref={buttonRef}></div>
        </div>
      </form>
    </div>
  );
}