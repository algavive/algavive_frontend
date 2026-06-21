import { Link } from 'react-router-dom'
import * as config from '../config'
import { useGoogleAuth, handleGoogleAuth } from '../components/GoogleAuth';

export default function Entry(){
const { buttonRef } = useGoogleAuth(
    async (userData) => {
      try {
        const turnstileToken = turnstileRef.current?.getResponse();
        
        if (!turnstileToken) {
          setError('Пожалуйста, подтвердите, что вы не робот');
          return;
        }

        const data = await handleGoogleAuth(userData, turnstileToken, 'register');
        
        setSuccess('Регистрация через Google успешна! Перенаправление...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
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
	<Link to="/register"><img src={`${config.STATIC_LOCATION}/IAmNew.png`} /></Link>
	<Link to="/login"><img src={`${config.STATIC_LOCATION}/IAmAlgavivec.png`} /></Link>
	<div className="oauth-divider">
        <span>или</span>
      </div>

      <div ref={buttonRef}></div>
</div>
)
}