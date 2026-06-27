import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import type { Project } from '../types'
import * as config from '../config'

import user from '../components/Profile'

export default function Settings(){

	const logout = () => {
		fetch(`${config.BACKEND_URL}/api/logout`, {
  			method: 'POST',
  			credentials: 'include'
		})
		document.location = "/"
	}

	return (
		<>
		{ user.logined &&
		(<button onClick={logout}>logout</button>)}
		</>
		)
}