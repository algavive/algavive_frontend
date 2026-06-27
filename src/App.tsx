import { Routes, Route } from 'react-router-dom'

import Settings from './urls/Settings'

import Header from './Header'
import Home from './urls/Home'
import HallOfFame from './urls/HallOfFame'
import Entry from './urls/Entry'

import Login from './urls/Login'
import Register from './urls/Register'
import ResetPass from './urls/ResetPass'

import Entertainment from './urls/Entertainment'
import MyProjects from './urls/MyProjects'
import Project from './urls/Project'
import Search from './urls/Search'

import MyProfile from './urls/MyProfile'
import User from './urls/User'

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
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/resetpass" element={<ResetPass />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/project" element={<Project />} />
        <Route path="/search" element={<Search />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/user" element={<User />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}
