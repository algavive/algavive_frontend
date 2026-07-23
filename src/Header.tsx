import { Link } from 'react-router-dom'
import * as config from './config'
import { ProfileHeader } from './components/ProfileHeader'
import { SearchButton } from './components/SearchButton'
import { NotificationButton } from './components/NotificationButton'

import user from './components/Profile'
import {GlobalResponse} from './components/Profile'


const Header = () => {
  return (
    <>
    <div className="header">
      <div className="h-menu">
        <Link to="/">
          <div className="h-title">
            
            <img src={`${config.STATIC_LOCATION}/algavive.png`} alt='logo' className="h-logo" />
          </div>
        </Link>
        <div className="h-buttons">
          <Link to="/hall-of-fame">Зал Славы</Link>
          {user.logined && (<Link to="/my-projects">Мои проекты</Link>)}
          <Link to="/entertainment">Центр Развлечений</Link>
        </div>
      </div>

      <div className="h-left-menu">
        {user.logined && (<Link to="/settings"><img src={`${config.STATIC_LOCATION}/settings.png`} alt='settings' className="h-logo search-button-wrapper" /></Link>)}
        <SearchButton />
        {/*user.logined && <NotificationButton />*/}
        <ProfileHeader />
      </div>
    </div>
    {user.banned && (
      <div className="header-banned" style={{backgroundColor:'#efefef'}}>
        Вас забанил {user.banned.admin_name} до {user.banned.duration === '9999-12-31 23:59:59' || user.banned.duration === 'always' 
          ? 'навсегда' 
          : new Date(user.banned.duration).toLocaleString('ru-RU', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, hour12: false })}
      </div>
    )}

    {GlobalResponse && (
      <div className="header-banned" style={{backgroundColor:'#efefef'}}>
        {GlobalResponse.error}
      </div>
      )
    }

    </>
  )
}

export default Header