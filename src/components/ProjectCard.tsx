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
      <div className="tp-author">{project.author}</div>
      <div className="tp-likes">
        {project.views}👁‍ {project.likes}❤ {project.comments}💬
      </div>
    </Link>
    </div>
  )
}

export default ProjectCard