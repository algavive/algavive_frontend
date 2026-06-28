import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import { Project, ProjectFilter, Celebrity } from '../types'
import * as config from '../config'
import Linkify from 'linkify-react';

export default function User(){

	const [activeFilter, setActiveFilter] = useState<ProjectFilter>('new')

	const testdesc = `чекни мой мэднесс комбат`

	const projects: Project[] = [
    {
      id: 380,
      title: 'Мэднесс комбат',
      author: 'GamerDev12672',
      type: 'Пост',
      imageUrl: null,
      likes: 15,
      comments: 4,
      views: 20
    }


  ]


  const handleFilterChange = (filter: ProjectFilter) => {
    setActiveFilter(filter)
  }

	return(
		<>	
			<div className="MyProfile">
				<div className="MP-left-side">
					<img src={`${config.STATIC_LOCATION}/emptyprofile.png`} alt='profile' className="MPLS-img" />
				</div>
				<div className="MP-right-side">
					<div className="MPRS-Name">
						GamerDev12672
						<img src={Celebrity} style={{height: '24px'}}/>
						<div style={{color: 'purple'}}>Sigma</div> {/*UserProfile.rankTitle?*/}
				</div>
					<div className="MPRS-Desc">
						<Linkify>{testdesc}</Linkify> {/*UserProfile.description?*/}
					</div>
				</div>
			</div>
			<div className="projects">
        <div className="p-title">Проекты пользователя:</div>
        <div className="p-buttons">
   				<div className="p-buttons">
          {/* Кнопки фильтров */}
          <button 
            className={activeFilter === 'new' ? 'active' : ''}
            onClick={() => handleFilterChange('new')}
          >
            Новые
          </button>
          <button 
            className={activeFilter === 'popular' ? 'active' : ''}
            onClick={() => handleFilterChange('popular')}
          >
            Популярные
          </button>
          <button 
            className={activeFilter === 'discussed' ? 'active' : ''}
            onClick={() => handleFilterChange('discussed')}
          >
            Обсуждаемые
          </button>
        </div>
        </div>
      </div>
      <div className="project-projects">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
		</>
		)
}