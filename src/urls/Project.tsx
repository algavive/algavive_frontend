import { useSearchParams } from 'react-router-dom'
import * as config from '../config'
import Linkify from 'linkify-react';

export default function Project(){
	const [searchParams] = useSearchParams()
  	const id = searchParams.get('id')
  	let desc = `Добро пожаловать в мэднесс комбат!

Если хотите поиграть то переходите по ссылке https://madness.com`
	return (
		<>
		<div className="PageProject">
		<ol>
		<div className="PageCard">
			<img src={`${config.STATIC_LOCATION}/cover.png`}></img>
		</div>
	</ol>
		<div className="PageCardInfo">
		<div className="PCI-type">
			Пост
		</div>
		<div className="PCI-profile">
		</div>
		<div className="PCI-something">
		</div>
			<div className="PCI-name">
			<h1>Мэднесс комбат</h1>
		</div>
		<div className="PCI-description">
			<Linkify>{desc}</Linkify>
		</div>
		</div>
		</div>
		</>
		)
}