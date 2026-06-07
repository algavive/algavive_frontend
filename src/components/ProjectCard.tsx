import type { Project } from '../types'
import { Link } from 'react-router-dom'

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="tp-card">
      <Link to={`/project?id=${project.id}`}>
      <div className="tp-img">
        <img src={project.imageUrl} alt={project.title} />
        <div className="tp-type">{project.type}</div>
      </div>
      <div className="tp-caption">{project.title}</div>
      <div className="tp-author">{project.author}</div>
      <div className="tp-likes">
        {project.likes}❤ {project.comments}💬
      </div>
    </Link>
    </div>
  )
}

export default ProjectCard