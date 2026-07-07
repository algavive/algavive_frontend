import type { Project } from '../types'
import { Link } from 'react-router-dom'
import * as config from '../config'
import {UserCards} from '../types'

interface UserCardProps {
  user: UserCards
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="tp-card">
      <Link to={`/user?id=${user.id}`}>

      <div className="tp-author">
      <img src={user.avatarUrl ? user.avatarUrl: `${config.STATIC_LOCATION}/emptyprofile.png`} alt='profile' className="JustProfile" 
        style={{borderRadius: '36px'}}/>
      <div className="tp-author-info">
      <div className="tp-author-name">
        {user.name}
        <img src={user.rankIcon} className="JustProfileIcon" 
          style={{borderRadius: '36px', height: '20px'}}/> 
      </div>
      <div style={{color: 'purple'}}>{user.rankTitle}</div> 
      </div>
      </div>
    </Link>
    </div>
  )
}

export default UserCard