import { useState, useRef, FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import * as config from '../config.ts';

export default function Login(){
	const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const turnstileRef = useRef<TurnstileInstance | null>(null);
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
	}
		return (
		<div className="Entry">
			<form onSubmit={handleSubmit}>
			<h1>Вход в аккаунт</h1>
			<h3>Введите логин:</h3>
			<input type="text" name="login" />
			<h3>Введите пароль:</h3>
			<input type="password" name="pass" />
			<Turnstile
          ref={turnstileRef}
          siteKey={config.SITEKEY_TURNSTILE}
          onError={() => setError('Ошибка загрузки капчи')}
        />
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
			<input type="submit" value="Войти" />
		</form>
		</div>
		)
}