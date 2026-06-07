import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project } from '../types'
import * as config from '../config'

const Trends = () => {
  const [activeTrend, setActiveTrend] = useState<'day' | 'week' | 'month'>('day')

//Там api просто допишу
  const projects: Project[] = [
    {
      id: 1,
      title: 'крутой шутан',
      author: 'Something',
      type: 'Скретч',
      imageUrl: null,
      likes: 25,
      comments: 5
    },
    {
      id: 3,
      title: 'Мэднес комбат',
      author: 'GamerDev12672',
      type: 'Пост',
      imageUrl: null,
      likes: 37,
      comments: 8
    },
    {
      id: 4,
      title: 'Когда я выучу реакт и хоноо',
      author: 'CoderPro',
      type: 'Видео',
      imageUrl: null,
      likes: 52,
      comments: 15
    }
  ]

  const handleTrendChange = (trend: 'day' | 'week' | 'month') => {
    setActiveTrend(trend)
  }

  return (
    <>
      <div className="trends">
        <div className="t-title">Тренды:</div>
        <div className="t-buttons">
          <button 
            className={activeTrend === 'day' ? 'active' : ''}
            onClick={() => handleTrendChange('day')}
          >
            Дня
          </button>
          <button 
            className={activeTrend === 'week' ? 'active' : ''}
            onClick={() => handleTrendChange('week')}
          >
            Недели
          </button>
          <button 
            className={activeTrend === 'month' ? 'active' : ''}
            onClick={() => handleTrendChange('month')}
          >
            Месяца
          </button>
        </div>
      </div>
      <div className="trends-projects">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  )
}

export default Trends