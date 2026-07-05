import { useState, useRef, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project, TrendPeriod } from '../types'
import * as config from '../config'

const Trends = () => {
  const [activeTrend, setActiveTrend] = useState<TrendPeriod>('day')
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTrends(activeTrend)
  }, [activeTrend])

  const fetchTrends = async (period: TrendPeriod) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/trends?period=${period}`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok) {
        const mapped = data.projects.map((p: any) => ({
          id: p.id,
          title: p.title,
          author: p.author,
          type: p.type,
          imageUrl: p.imageUrl,
          likes: p.likes || 0,
          comments: p.comments || 0,
          views: p.views || 0,
          authorIcon: p.authorIcon,
          authorTitle: p.authorTitle,
          authorProfile: p.authorProfile,
        }))
        setProjects(mapped)
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error('Ошибка загрузки трендов', error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrendChange = (trend: TrendPeriod) => {
    setActiveTrend(trend)
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
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
      <div className="trends-projects" ref={scrollRef}>
        {isLoading && <div style={{ padding: '20px'}}>Загрузка...</div>}
        {!isLoading && projects.length === 0 && (
          <div style={{ padding: '20px', color: '#666' }}>Нет проектов в трендах</div>
        )}
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {!projects && <h1>Пока нету проектов в трендах</h1>}
      </div>
    </>
  )
}

export default Trends