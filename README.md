# Механизация — заявки на закупку ТМЦ

Реализация ТЗ v0.1: автоматизация дефектных актов и заявок на закупку по направлению «Механизация».

## Стек

| Компонент | Технология |
|-----------|------------|
| Backend | .NET 10, Minimal API, MediatR, EF Core |
| БД | PostgreSQL (отдельная `tnsu_inventory`) |
| Справочники 1С | `api.tnsu.kz` — `/Dictionary/Projects1C`, `/Dictionary/vehicles` |
| Frontend | Vue 3 + Vite + Naive UI (как `tansu/frontend`), встраивается в SPFx |
| SharePoint | https://tnsukz.sharepoint.com/sites/kps |
| Вложения | SharePoint (Graph) + локальная копия |
| Уведомления SLA | SMTP + Teams Adaptive Card |

## Бизнес-процесс

```
Дефектный акт (черновик)
  → Согласование (кладовщик → СБ → РП → координатор → гл. механик)
  → Подписан
  → Заявка на закупку (поля проект/техника/VIN переносятся)
  → Согласование (пропуск ролей, уже согласовавших дефектный акт)
  → Утверждена → Назначен исполнитель ОМТС → В работе → Закрыта
```

### Регламент

- **Лимит 500 000 ₸** — без вложения СТ (служебной записки) отправка на согласование блокируется
- **SLA 1 рабочий день** — напоминание согласующему, эскалация руководителю и главному механику
- **Возврат на доработку** — маршрут продолжается с шага возврата (настраивается `ResumeFromReturnStep`)
- **Удаление запрещено** — только статус «Отменена» с комментарием

## Быстрый старт

### 1. Backend + Postgres + Frontend (Docker)

```bash
cd tnsu-Inventory
cp .env.example .env
docker compose up -d --build
```

| Сервис | URL |
|--------|-----|
| **Frontend (Vue)** | https://localhost:5173 |

> Docker отдаёт **HTTPS** (сертификаты из `frontend/certs/`). `http://` автоматически перенаправляется на `https://`.

### Если страница «висит» и не открывается

Порт 5173 часто занят старым `vite`/`node` (после `npm run dev`). Освободите порт:

```bash
lsof -i :5173
kill <PID>   # процесс node, не com.docker
docker compose up -d frontend
```

Проверка: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/` должно вернуть `200`.
| API | http://localhost:8081 |
| API health | http://localhost:8081/health |
| Mailhog | http://localhost:8027 |
| Postgres | localhost:5434 |

Frontend проксирует `/api` на контейнер `api` через nginx — отдельный `VITE_API_BASE` не нужен.

**Авторизация** (как в `tansu/frontend`):
- **Entra**: Microsoft Entra ID (`VITE_ENTRA_*` + `Entra__*` в `.env`) — для согласующих с корпоративной учёткой
- **Dev-вход** (только `Development`): на странице `/login` под кнопкой Microsoft — email + `POST /api/auth/dev-login` → JWT в `localStorage`. В Docker включён через `VITE_SHOW_DEV_LOGIN=true`.

**Microsoft Entra:** redirect URI `https://localhost:5173/login` (как в `tansu/frontend`). Перед запуском inventory остановите tansu: `cd ../tansu && docker compose down`.

Демо-аккаунты для dev-входа — см. таблицу ниже.

```bash
docker compose logs -f api frontend
docker compose down
```

### 2. Локальная разработка API

```bash
cd backend
dotnet run --project src/Tnsu.Inventory.Api
```

В dev-режиме без Entra используется заголовок `X-Dev-User-Email` (см. `appsettings.json` → `DevAuth:Email`).

Демо-пользователи (сидируются при запуске API):

| Email | Роль | Назначение |
|-------|------|------------|
| **onglassyn.dauren@tnsukz.onmicrosoft.com** | Главный механик | Согласование (Entra) |
| **mechanic@tansu.local** | Механик участка | Создание актов и заявок (**dev-вход**, без Entra) |
| storekeeper@tansu.local | Кладовщик проекта | Согласование (dev) |
| security@tansu.local | СБ | Согласование (dev) |
| pm@tansu.local | РП / Нач. участка | Согласование (dev) |
| warehouse@tansu.local | Координатор СХ | Согласование (dev) |
| omts.head@tansu.local | Руководитель ОМТС | Исполнение (dev) |
| omts@tansu.local | Специалист ОМТС | Исполнение (dev) |

**Демо-документы** (сид `PR-DEMO-00002`):
- `PR-DEMO-00001` — черновик заявки (механик)
- `PR-DEMO-00002` — на согласовании у **Дәурена** (шаг «Главный механик») → раздел «Входящие согласования»
- `DA-DEMO-00001` — подписанный дефектный акт

### 3. Frontend (Vue 3)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

При наличии `frontend/certs/localhost.pem` dev-сервер поднимается на **https://localhost:5173** (как в `tansu/frontend`).
Сертификаты скопированы из `tansu/frontend/certs/`.

Откройте https://localhost:5173 (или http://localhost:5173 в Docker) — при первом заходе откроется страница входа.
В dev-режиме войдите по email (например `mechanic@tansu.local`).

### 4. SPFx (SharePoint)

```bash
cd frontend && npm run build
# Скопируйте dist в spfx, затем:
cd spfx
npm install
gulp bundle --ship
gulp package-solution --ship
```

Разверните `.sppkg` в App Catalog и добавьте веб-часть «Механизация — закупки» на сайт KPS.

## API (основные endpoints)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/dictionaries/projects` | Проекты из 1С |
| GET | `/api/dictionaries/vehicles` | Техника (ОС) |
| CRUD | `/api/defect-acts` | Дефектные акты |
| POST | `/api/defect-acts/{id}/submit` | На согласование |
| POST | `/api/defect-acts/{id}/purchase-request` | Создать заявку из акта |
| CRUD | `/api/purchase-requests` | Заявки на закупку |
| POST | `/api/purchase-requests/{id}/submit` | На согласование |
| GET | `/api/approvals/inbox` | Входящие задачи |
| POST | `/api/approvals/{stepId}/approve` | Согласовать |
| GET | `/api/dictionaries/project-sections` | Разделы проекта |
| GET | `/api/dictionaries/work-types` | Виды работ |
| GET | `/api/dictionaries/nomenclature` | Номенклатура / АГСК |
| GET | `/api/dictionaries/contractors` | Контрагенты |
| GET | `/api/defect-acts/{id}/print` | Печатная форма дефектного акта (HTML) |
| POST | `/api/purchase-requests/{id}/attachments` | Загрузка вложения (СТ → SharePoint) |
| POST | `/api/purchase-requests/{id}/supplier-order` | Заказ поставщику (ОМТС) |

## Структура проекта

```
tnsu-Inventory/
├── backend/           # .NET 10 API
├── frontend/          # Vue 3 SPA
├── spfx/              # SharePoint Framework web part
├── docker-compose.yml
└── README.md
```

## Реализованные интеграции

### Печатная форма дефектного акта
`GET /api/defect-acts/{id}/print` — HTML-форма по структуре шаблона 152 (проект, техника, неисправность, запчасти, подписи). Кнопка «Печать» в карточке акта.

### Вложения СТ (SharePoint)
- Загрузка через `POST /api/purchase-requests/{id}/attachments` (`category=service_note`)
- При `SharePoint:Enabled=true` — загрузка в библиотеку `MechanizationAttachments` через Microsoft Graph (версионирование на стороне SharePoint)
- Локальная копия сохраняется для скачивания

### Teams Adaptive Cards (SLA)
При настройке `Teams:WebhookUrl` SLA-напоминания и эскалации дублируются в Teams с кнопкой «Открыть документ».

### Заказ поставщику
Специалист ОМТС создаёт заказ через `POST /api/purchase-requests/{id}/supplier-order`. При `Procurement:BaseUrl` — отправка в общую систему закупок, иначе локальный номер `SO-YYYY-NNNNN`.

### Справочники 1С
| Endpoint | Справочник |
|----------|------------|
| `/api/dictionaries/projects` | Проекты |
| `/api/dictionaries/vehicles` | Техника (ОС) |
| `/api/dictionaries/project-sections?projectId=` | Разделы проекта |
| `/api/dictionaries/work-types` | Виды работ |
| `/api/dictionaries/nomenclature?search=` | Номенклатура |
| `/api/dictionaries/contractors?search=` | Контрагенты |

При недоступности API возвращаются демо-данные для разработки.
