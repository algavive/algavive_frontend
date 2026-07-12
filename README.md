# Как запустить в локальном режиме

Всё просто, только придется с бэкендом лучше запускать: https://github.com/algavive/algavive_backend

1. Склонировать репозиторий `git clone https://github.com/algavive/algavive_frontend`
2. Установить зависимости `npm install`
3. Запустить `npm start`

# Про src/config.ts

Это конфигурационный файл, который настраивает логику фронтенда.

Например также, как и в бэкенде встретим такой кусок кода:
```typescript
export const BACKEND_URL: string = FRONTDEV_MODE /* Самое главное вставьте Backend_url так как он будет отсылать к api логике*/
? "http://localhost:8787"
: "https://api.algavive.workers.dev"; 
```

При обычном локальном запуске фронтенда, можно ничего не менять, но когда нужно подключить свой oauth, бэкенд ссылку или oauth.
То придется воспользоваться.

Также статик локэйшн:
```typescript
export const STATIC_LOCATION: string = ""
```

Применялся давно для того, чтобы сделать местоположение статичных файлов, но сейчас бесполезна.
