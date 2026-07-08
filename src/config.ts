export const STATIC_LOCATION: string = ""
//Публичные ключи
export const GOOGLE_CLIENT_ID: string = "55121685745-c31lj4mjqtrfobfthu3i8p3l1gau4bkf.apps.googleusercontent.com"; // ключ от google console для oautn
//фронтдев мод
export const FRONTDEV_MODE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0';

//Если нужна продакшн капча в localhost, можно вписать captcha_devmode = false
let captcha_devmode = FRONTDEV_MODE

export const SITEKEY_TURNSTILE: string = captcha_devmode ? 
"1x00000000000000000000AA"
: "0x4AAAAAADNYSY_vwXC2FIFb"; //Напишите ваш другой ключ от cloudflare turnstile*/

//Режим для локал хоста сверху, для продакшн снизу
export const BACKEND_URL: string = FRONTDEV_MODE /* Самое главное вставьте Backend_url так как он будет отсылать к api логике*/
? "http://localhost:8787"
: "https://api.algavive.workers.dev"; 