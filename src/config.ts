//Публичные ключи
export const SITEKEY_TURNSTILE: string = "0x4AAAAAADNYSY_vwXC2FIFb"; //Напишите ваш другой ключ от cloudflare turnstile
export const GOOGLE_CLIENT_ID: string = "55121685745-c31lj4mjqtrfobfthu3i8p3l1gau4bkf.apps.googleusercontent.com"; // ключ от google console для oautn
//фронтдев мод
export const FRONTDEV_MODE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0';

//Режим для локал хоста сверху, для продакшн снизу
export const BACKEND_URL: string = FRONTDEV_MODE /* Самое главное вставьте Backend_url так как он будет отсылать к api логике*/
? "http://localhost:8787"
:""; 
export const STATIC_LOCATION: string = "static"