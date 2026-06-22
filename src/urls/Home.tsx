import Trends from '../components/Trends'
import Projects from '../components/Projects'

import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import * as config from '../config'
import Linkify from 'linkify-react';

const Home = () => {
  return (
    <>
    <div>
    <h1>Добро пожаловать в Algavive</h1>
    
    <Linkify>{
`Так как в этом сайте нету привычной загрузки файлов, как в других сайтах.
Из-за экономии и старта в бесплатном хостинге. 
Мы предлагаем использовать файлообменики, типо: catbox.moe ;
imgbb.com ; posty5.com ; гугл диск и тд.`
              }</Linkify>
    </div>
    </>
  )
}

export default Home