

export default function Login(){
	return (
		<div className="Entry">
			<form method="get" action="authL">
			<h1>Вход в аккаунт</h1>
			<h3>Введите логин:</h3>
			<input type="text" name="login" />
			<h3>Введите пароль:</h3>
			<input type="password" name="pass" />
			<h3></h3>
			<input type="submit" value="Войти" />
		</form>
		</div>
		)
}