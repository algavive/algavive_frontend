import * as config from '../config'
import { Link } from 'react-router-dom'
import user from './Profile'

export function ProfileHeader() {
	if (user.logined) {
		return (
			<Link to="/my-profile">
			<div className="h-profile-name">
          		{user.name}
          		<img src={user.avatarUrl ? user.avatarUrl : `${config.STATIC_LOCATION}/emptyprofile.png`} alt='profile' className="JustProfile" style={{borderRadius: '36px'}} />
      		</div>
      	</Link>
			)
	} else {
		return (
			<Link to="/entry">
			<div className="button-RegOrLogin">
          Войти/Зарегистрироваться
      </div>
    </Link>
			)
	}
}