import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import * as config from '../config';
import { useGoogleAuth } from '../components/GoogleAuth';

export default function Entry() {
  return (
    <div className="Entry">
      <h1>Ты кто?</h1>
      <Link to="/login">
        <img src={`${config.STATIC_LOCATION}/IAmAlgavivec.png`} alt="Уже есть аккаунт" />
      </Link>
      <Link to="/register">
        <img src={`${config.STATIC_LOCATION}/IAmNew.png`} alt="Новый пользователь" />
      </Link>
    </div>
  );
}

/*
Я это уберу, так как не вижу смысла, если в /register добавлю

<div className="oauth-divider">
        <span>или можете зарегистрироваться по oauth</span>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>

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
*/