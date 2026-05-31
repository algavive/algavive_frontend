import { Link } from 'react-router-dom'
import * as config from '../config'

export default function Entry(){
return (
<div className="Entry">
	<h1>Ты кто?</h1>
	<Link to="/register"><img src={`${config.STATIC_LOCATION}/IAmNew.png`} /></Link>
	<Link to="/login"><img src={`${config.STATIC_LOCATION}/IAmAlgavivec.png`} /></Link>
</div>
)
}