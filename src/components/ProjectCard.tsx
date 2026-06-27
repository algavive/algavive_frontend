import type { Project } from '../types'
import { Link } from 'react-router-dom'
import * as config from '../config'

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="tp-card">
      <Link to={`/project?id=${project.id}`}>
      <div className="tp-img">
        <img src={project.imageUrl ? project.imageUrl : `${config.STATIC_LOCATION}/cover.png`} alt={project.title} />
        <div className="tp-type">{project.type}</div>
      </div>
      <div className="tp-caption">{project.title}</div>
      <div className="tp-author">
      <img src={project.authorProfile ? project.authorProfile: `${config.STATIC_LOCATION}/emptyprofile.png`} alt='profile' className="JustProfile" 
        style={{borderRadius: '36px'}}/>
      <div className="tp-author-info">
      <div className="tp-author-name">
        {project.author}
        <img src={project.authorIcon} className="JustProfile" 
          style={{borderRadius: '36px', height: '20px'}}/> 
      </div>
      <div style={{color: 'purple', fontSize: '13px'}}>{project.authorTitle}</div> 
    </div>
  </div>
      <div className="tp-likes">
        {project.views}👁‍ {project.likes}👍 {project.comments}💬
      </div>
    </Link>
    </div>
  )
}

export default ProjectCard