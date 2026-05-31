import { useState, useRef, FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import * as config from '../config.ts';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: formData.get('login'),
          pass: formData.get('pass'),
          email: formData.get('email'),
          turnstileToken: token,
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
      <form onSubmit={handleSubmit}>
        <h1>Регистрация</h1>
        
        <h3>Введите логин:</h3>
        <input type="text" name="login" required disabled={isLoading} />
        
        <h3>Введите пароль:</h3>
        <input type="password" name="pass" required disabled={isLoading} />
        
        <h3>Введите email (экспериментально):</h3>
        <input type="email" name="email" disabled={isLoading} />
        
        <Turnstile
          ref={turnstileRef}
          siteKey={config.SITEKEY_TURNSTILE}
          onError={() => setError('Ошибка загрузки капчи')}
        />
        
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
        
        <input 
          type="submit" 
          value={isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}