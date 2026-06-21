import { useEffect, useRef } from 'react';
import * as config from '../config';

declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleUserData {
  id: string;
  email: string;
  name: string;
  avatar: string;
  token: string;
}


export function useGoogleAuth(
  onSuccess: (userData: GoogleUserData) => Promise<void>,
  onError?: (error: string) => void
) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: config.GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            const userData: GoogleUserData = {
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              avatar: payload.picture,
              token: response.credential
            };
            
            await onSuccess(userData);
          } catch (err) {
            onError?.('Ошибка обработки Google токена');
          }
        }
      });
      
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with'
        });
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptElement) scriptElement.remove();
    };
  }, [onSuccess, onError]);

  return { buttonRef };
}


export async function handleGoogleAuth(
  userData: GoogleUserData,
  turnstileToken: string | null | undefined,
  mode: 'login' | 'register'
) {

  const response = await fetch(`${config.BACKEND_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      googleToken: userData.token,
      turnstileToken: turnstileToken || null,
      mode: mode
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `Ошибка ${mode === 'login' ? 'входа' : 'регистрации'} через Google`);
  }
  
  return data;
}