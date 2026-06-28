import { useState, useRef, FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import * as config from '../config';
import { useGoogleAuth } from '../components/GoogleAuth';

export default function ResetPass() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('')
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

        const response = await fetch(`${config.BACKEND_URL}/api/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            login: login,
            googleToken: userData.token
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess(`Новый пароль, был успешно поставлен.`);
          setTimeout(() => {
            window.location.href = '/login';
          }, 5000);
        } else {
          setError(data.error || 'Ошибка сброса пароля');
          turnstileRef.current?.reset();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка сброса пароля через Google');
        turnstileRef.current?.reset();
      }
    },
    (errorMessage) => {
      setError(errorMessage);
    }
  );
  return (<h1> Из-за производственного ада с демо релизом, я уберу страницу восстановления пароля </h1>)
  /*
  return (
    <div className="Entry">
      <h1>Восстановление пароля</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        {`Сброс пароля работает только для аккаунтов с привязанным Google OAuth.`}
      </p>
      <h4>Если вы заранее прописали логин и пароль и зарегистрировались по oauth, то вы можете поставить новый из двух вариантов или все.</h4>
      <h4>Если вы зарегистрировались только по oauth, то тогда надо вводить логин и пароль, если вы ходите в вашем аккаунте поставить</h4>

      <form onSubmit={(e) => e.preventDefault()}>
        <h3>Введите новый логин:</h3>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Ваш логин"
          disabled={isLoading}
        />
        <p>или</p>
        <h3>Введите новый пароль:</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ваш пароль"
          disabled={isLoading}
        />

        <h3>Подтвердите через Google:</h3>
        <Turnstile
          ref={turnstileRef}
          siteKey={config.SITEKEY_TURNSTILE}
          onError={() => setError('Ошибка загрузки капчи')}
        />

        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && (
          <div style={{ color: 'green', marginTop: '10px', wordBreak: 'break-all' }}>
            {success}
          </div>
        )}

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            Нажмите кнопку для подтверждения через Google
          </p>
          <div ref={buttonRef}></div>
        </div>
      </form>
    </div>
  );*/
}
/* 
<input type="submit" value="Отправить" />


<form onSubmit={handleSubmit}>
			<h2>Введите email (экспериментально 2FA):</h2>
        	<input type="email" name="email" disabled={isLoading} />
			<Turnstile
          ref={turnstileRef}
          siteKey={config.SITEKEY_TURNSTILE}
          onError={() => setError('Ошибка загрузки капчи')}
        />
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
        	<input type="submit" value="Отправить" />
		</form>

<form>
			<h2>Введите код полученный с email и новый пароль:</h2>
			<h3>Код:</h3>
        	<input type="password" name="code" disabled={isLoading} />
        	<h3>Пароль:</h3>
        	<input type="password" name="changepass" disabled={isLoading} />
        	<h1/>
        	<input type="submit" value="Отправить" />
        	
		</form>

*/