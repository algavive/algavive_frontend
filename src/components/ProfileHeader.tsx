import * as config from '../config'
import { Link } from 'react-router-dom'

const test = {
  logined: true,
  name: "John Doe"
}

export function ProfileHeader() {
	if (test.logined) {
		return (
			<Link to="/my-profile">
			<div className="h-profile-name">
          		{test.name}
          		<img src={`${config.STATIC_LOCATION}/emptyprofile.png`} alt='profile' className="h-profile" style={{borderRadius: '36px'}} />
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