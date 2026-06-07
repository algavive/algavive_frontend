import { useState, useRef, FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import * as config from '../config.ts';

export default function ResetPass(){
	const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const turnstileRef = useRef<TurnstileInstance | null>(null);
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
	}
		return (
		<div className="Entry">
			<h1>Восстановления пароля(экспериментально)</h1>
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
		</div>
		)
}