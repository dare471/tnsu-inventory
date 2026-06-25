# Механизация — заявки на закупку ТМЦ

Автоматизация дефектных актов и заявок на закупку по направлению «Механизация».

## Стек

| Компонент | Технология |
|-----------|------------|
| Backend | .NET 10, Minimal API, MediatR, EF Core |
| БД | PostgreSQL (`tnsu_inventory`) |
| Справочники 1С | `api.tnsu.kz` |
| Frontend | Vue 3 + Vite + Naive UI, SPFx |
| SharePoint | https://tnsukz.sharepoint.com/sites/kps |
| Вложения | SharePoint (Graph) + локальное хранилище |
| Уведомления SLA | SMTP + Teams Adaptive Card |

## Бизнес-процесс

```
Дефектный акт (черновик)
  → Согласование (кладовщик → СБ → РП → координатор → гл. механик)
  → Подписан
  → Заявка на закупку
  → Согласование
  → Утверждена → ОМТС → В работе → Закрыта
```

### Регламент

- Лимит **500 000 ₸** — без СТ отправка на согласование блокируется
- SLA **1 рабочий день** — напоминание и эскалация
- Возврат на доработку — маршрут продолжается с шага возврата
- Удаление запрещено — только статус «Отменена»

## Быстрый старт

### Docker

```bash
cp .env.example .env
docker compose up -d --build
```

| Сервис | URL |
|--------|-----|
| Frontend | https://localhost:5173 |
| API | http://localhost:8081 |
| API health | http://localhost:8081/health |
| Mailhog | http://localhost:8027 |
| Postgres | localhost:5434 |

Frontend проксирует `/api` на контейнер `api`.

**Авторизация:**
- Entra ID — `VITE_ENTRA_*` и `Entra__*` в `.env`
- Локальный вход — `POST /api/auth/dev-login` (Development, `VITE_SHOW_DEV_LOGIN=true`)

Redirect URI Entra: `https://localhost:5173/login`

```bash
docker compose logs -f api frontend
docker compose down
```

### Локальная разработка API

```bash
cd backend
dotnet run --project src/Tnsu.Inventory.Api
```

Без Entra — заголовок `X-Dev-User-Email` или `DevAuth:Email` в `appsettings.json`.

Тестовые пользователи (сид при старте):

| Email | Роль |
|-------|------|
| onglassyn.dauren@tnsukz.onmicrosoft.com | Главный механик |
| mechanic@tansu.local | Механик участка |
| storekeeper@tansu.local | Кладовщик проекта |
| security@tansu.local | СБ |
| pm@tansu.local | РП участка |
| warehouse@tansu.local | Координатор СХ |
| omts.head@tansu.local | Руководитель ОМТС |
| omts@tansu.local | Специалист ОМТС |

Сид-документы: `DA-DEMO-00001`, `PR-DEMO-00001` (черновик), `PR-DEMO-00002` (на согласовании).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

HTTPS при наличии `frontend/certs/localhost.pem`.

### SPFx

```bash
cd frontend && npm run build
cd spfx
npm install
gulp bundle --ship
gulp package-solution --ship
```

Разверните `.sppkg` в App Catalog, добавьте веб-часть на сайт KPS.

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/dictionaries/projects` | Проекты |
| GET | `/api/dictionaries/vehicles` | Техника |
| CRUD | `/api/defect-acts` | Дефектные акты |
| POST | `/api/defect-acts/{id}/submit` | На согласование |
| POST | `/api/defect-acts/{id}/purchase-request` | Заявка из акта |
| CRUD | `/api/purchase-requests` | Заявки |
| POST | `/api/purchase-requests/{id}/submit` | На согласование |
| GET | `/api/approvals/inbox` | Входящие |
| POST | `/api/approvals/{stepId}/approve` | Согласовать |
| GET | `/api/dictionaries/project-sections` | Разделы проекта |
| GET | `/api/dictionaries/work-types` | Виды работ |
| GET | `/api/dictionaries/nomenclature` | Номенклатура |
| GET | `/api/dictionaries/contractors` | Контрагенты |
| GET | `/api/defect-acts/{id}/print` | Печатная форма |
| POST | `/api/purchase-requests/{id}/attachments` | Вложение |
| POST | `/api/purchase-requests/{id}/supplier-order` | Заказ поставщику |

## Структура

```
tnsu-Inventory/
├── backend/
├── frontend/
├── spfx/
├── docker-compose.yml
└── README.md
```

## Интеграции

**Печатная форма** — `GET /api/defect-acts/{id}/print`, HTML по шаблону 152.

**Вложения СТ** — `POST /api/purchase-requests/{id}/attachments`, SharePoint при `SharePoint:Enabled=true`.

**Teams** — SLA-уведомления при `Teams:WebhookUrl`.

**Заказ поставщику** — `POST /api/purchase-requests/{id}/supplier-order`, интеграция с `Procurement:BaseUrl`.

**Справочники 1С** — проекты, техника, разделы, виды работ, номенклатура, контрагенты. При недоступности API — резервные данные.
