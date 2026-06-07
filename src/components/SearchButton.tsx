import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const SearchButton = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'user' | 'project'>('project')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    navigate(`/search?name=${encodeURIComponent(searchQuery)}&type=${searchType}`)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="search-button-wrapper" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <img src="/search.png" alt='search' className="h-profile"/>
      </button>
      
      {isOpen && (
        <div className="search-menu">
          <div className="search-header">Поиск</div>
          <div className="search-input-group">
            <input 
              type="text" 
              placeholder="Введите название..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <button onClick={handleSearch}>ОК</button>
          </div>
          <div className="search-type">
            <label className={searchType === 'project' ? 'active' : ''}>
              <input 
                type="radio" 
                value="project" 
                checked={searchType === 'project'}
                onChange={() => setSearchType('project')}
              /> Проекты
            </label>
            <label className={searchType === 'user' ? 'active' : ''}>
              <input 
                type="radio" 
                value="user" 
                checked={searchType === 'user'}
                onChange={() => setSearchType('user')}
              /> Пользователи
            </label>
          </div>
        </div>
      )}
    </div>
  )
}