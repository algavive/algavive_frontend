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
    <h1>Добро пожаловать в Демо-Релиз Algavive</h1>
    
    <Linkify><pre>{
`
https://github.com/algavive - репозиторий гитхаба с открытым исходным кодом

Алговайв хоститься в бесплатном хостинге cloudflare pages и workers.

Правила Algavive, из-за теста, временно будет подчиняться сообществу АлгоДачи: https://telegra.ph/Pravila-AlgoDachi-07-16 и https://t.me/AlgoDacha

Так как я не успел дописать политику конфинденциальности, так что расскажу про это информацию: 
при регистрации аккаунта через гугл, сохраняет в базе данных только сам айди аккаунта(то есть это 
безопасно и не возможно найти по айди какой нибудь аккаунт или email), а пароли в классической 
регистрацией шифруется на sha256+соль.

!!ПРО ЗАГРУЗКУ ФАЙЛОВ И ВСТАВКИ ССЫЛКИ НА ИЗОБРАЖЕНИЯ!!
Так как в этом сайте нету привычной загрузки файлов, как в других сайтах.
Из-за экономии и старта в бесплатном хостинге. 
Мы предлагаем использовать файлообменики, типо: www.image2url.com ; catbox.moe (поддерживает sb3) ;
imgbb.com ; posty5.com (для Web(html) проектов) ; github pages (для веба или даже хостинга другого) ; 
vercel.app (тоже) ; гугл диск(через lh3.googleusercontent.com ;
также для разговорников google docs ссылкой) ; также встроенные ссылки, например "cover.png" или "emptyprofile.png"
Еще к обновлению добавились: pagedrop.io , boomurl.com , iimg.live , x02.me

Сайт запрещает со сторонних ссылок загружать файлы, кроме выше перечисленных.
`
              }</pre></Linkify>
    </div>
    </>
  )
}

export default Home