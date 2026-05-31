import { Link } from 'react-router-dom'
import * as config from '../config'
import {ProfileHeader} from '../components/ProfileHeader'

let admin: boolean = false

const Header = () => {
  return (
    <div className="header">
      <div className="h-menu">
      <Link to="/"><div className="h-title"><img src={`${config.STATIC_LOCATION}/algavive.png`} alt='logo' className="h-logo"/></div></Link>
      <div className="h-buttons">
        <Link to="/hall-of-fame">Зал Славы</Link>
        <Link to="/my-projects">Мои проекты</Link>
        <Link to="/entertainment">Центр Развлечений</Link>
        {admin && <Link to="/admin">Админ-права</Link>}

      </div>
      </div>
      <div className="h-left-menu">
      <button><img id="h-profile-search" src={`${config.STATIC_LOCATION}/search.png`} alt='profile' className="h-profile"/></button>  
      <button><img id="h-profile-push" src={`${config.STATIC_LOCATION}/push.png`} alt='push' className="h-profile"/></button>
      <ProfileHeader />
    </div>
    </div>
  )
}

export default Header