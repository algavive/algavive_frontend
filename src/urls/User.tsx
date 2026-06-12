import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project } from '../types'
import * as config from '../config'
import Linkify from 'linkify-react';

export default function User(){

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

	return(
		<>	
			<div className="MyProfile">
				<div className="MP-left-side">
					<img src={`${config.STATIC_LOCATION}/emptyprofile.png`} alt='profile' className="MPLS-img" />
				</div>
				<div className="MP-right-side">
					<div className="MPRS-Name">GamerDev12672</div>
					<div className="MPRS-Desc">
						<Linkify>{testdesc}</Linkify>
					</div>
				</div>
			</div>
			<div className="projects">
        <div className="p-title">Проекты пользователя:</div>
        <div className="p-buttons">
   
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