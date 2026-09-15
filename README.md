# FILM!

## Деплой

Приложение доступно по адресу:

[axeliriya-film.nomorepartiessite.ru](http://axeliriya-film.nomorepartiessite.ru)

## Установка

### PostgreSQL

Для локального запуска базы данных используется Docker Compose.

Создайте файл `.env.docker` на основе корневого `.env.example`:

```bash
cp .env.example .env.docker
```

При необходимости измените значения переменных окружения в `.env.docker`.

Запустите приложение из корня проекта:

```bash
docker compose up -d --build
```

При первом запуске PostgreSQL автоматически создаёт таблицы и загружает тестовые данные из файлов:

- `backend/test/prac.init.sql`
- `backend/test/prac.films.sql`
- `backend/test/prac.shedules.sql`

Приложение будет доступно по адресу:

```text
http://localhost
```

pgAdmin будет доступен по адресу:

```text
http://localhost:8080
```

### Повторная инициализация базы данных

SQL-скрипты выполняются только при создании пустого тома PostgreSQL.

Чтобы полностью пересоздать локальную базу данных:

```bash
docker compose down -v
docker compose up -d --build
```

Важно: команда `docker compose down -v` удаляет данные локальной базы PostgreSQL.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда:

`cd backend`

Установите зависимости:

`npm i`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

- `DATABASE_DRIVER` — тип драйвера СУБД, в данном проекте `postgres`
- `DATABASE_URL` — адрес PostgreSQL, например `postgres://127.0.0.1:5432/films`
- `DATABASE_USERNAME` — имя пользователя БД
- `DATABASE_PASSWORD` — пароль пользователя БД
- `LOGGER` — формат логирования
- `PORT` — порт бэкенда, по умолчанию `3000`

PostgreSQL должна быть установлена и запущена.

Запустите бэкенд:

`npm run start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.

По умолчанию API будет доступен по адресу:

```text
http://localhost:3000/api/afisha
```

### Фронтенд

Перейдите в папку с исходным кодом фронтенда:

`cd frontend`

Установите зависимости:

`npm i`

Создайте `.env` файл из примера `.env.example`.

Переменные окружения:

```
VITE_API_URL=/api/afisha
VITE_CDN_URL=/content/afisha
```

Запустите фронтенд в режиме разработки:

`npm run dev`

Приложение откроется по адресу `http://localhost:5173`.

```

```
