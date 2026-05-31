import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="tp-card">
      <div className="tp-img">
        <img src={project.imageUrl} alt={project.title} />
        <div className="tp-type">{project.type}</div>
      </div>
      <div className="tp-caption">{project.title}</div>
      <div className="tp-author">{project.author}</div>
      <div className="tp-likes">
        {project.likes}❤ {project.comments}💬
      </div>
    </div>
  )
}

export default ProjectCard