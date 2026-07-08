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
    
    <Linkify><pre>{
`
https://github.com/algavive - репозиторий гитхаба с открытым исходным кодом

Правила Algavive, из-за теста, временно будет подчиняться сообществу АлгоДачи: https://telegra.ph/Pravila-AlgoDachi-05-09

Так как в этом сайте нету привычной загрузки файлов, как в других сайтах.
Из-за экономии и старта в бесплатном хостинге. 
Мы предлагаем использовать файлообменики, типо: www.image2url.com ; catbox.moe ;
imgbb.com ; posty5.com (для html проектов) ; github pages (для сайтов) ; vercel.app ; 
гугл диск(через lh3.googleusercontent.com ;
также для разговорников google docs ссылкой) и тд.
`
              }</pre></Linkify>
    </div>
    </>
  )
}

export default Home