import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './urls/Home'
import HallOfFame from './urls/HallOfFame'
import Entry from './urls/Entry'

import Login from './urls/Login'
import Register from './urls/Register'

import Entertainment from './urls/Entertainment'

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hall-of-fame" element={<HallOfFame />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/entertainment" element={<Entertainment />} >
      </Routes>
    </div>
  )
}
