# Механизация — заявки на закупку ТМЦ

Дефектные акты и заявки на закупку ТМЦ, направление «Механизация».

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
| onglassyn.dauren@tnsukz.onmicrosoft.com | Главный механик (админ) |
| m.trishina@kgnt.kz | Механик участка |
| mechanic@tansu.local | Механик участка |
| storekeeper@tansu.local | Кладовщик проекта |
| security@tansu.local | СБ |
| pm@tansu.local | РП участка |
| warehouse@tansu.local | Координатор СХ |
| omts.head@tansu.local | Руководитель ОМТС |
| omts@tansu.local | Специалист ОМТС |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

HTTPS при наличии `frontend/certs/localhost.pem`.

### SharePoint (KPS)

UI встраивается через SPFx на портал KPS. Авторизация — сессия SharePoint (Entra ID), данные — PostgreSQL через backend API.

```
SharePoint KPS (SPFx)
        │  Bearer token
        ▼
Backend API (.NET, Entra ID, HTTPS)
        ▼
PostgreSQL
```

**Веб-части:**

| Веб-часть | Назначение |
|-----------|------------|
| Механизация — списки | Дефектные акты, заявки, входящие |
| Механизация — дефектный акт | Форма акта |
| Механизация — заявка | Форма заявки, печать |

**Сборка `.sppkg` (Node 22):**

```bash
cd frontend && npm run build:embed
cd ../spfx && npm install --legacy-peer-deps && npm run package-solution
```

Пакет: `spfx/sharepoint/solution/tnsu-inventory-mechanization.sppkg`

**Свойства веб-части на странице:**

| Свойство | Описание |
|----------|----------|
| URL API | Публичный адрес backend |
| Entra audience | `api://{client-id}` |
| ID документа | GUID (для форм; пусто — новый акт) |

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
| GET | `/api/defect-acts/{id}/print` | Печать дефектного акта |
| GET | `/api/purchase-requests/{id}/print` | Печать заявки |
| POST | `/api/purchase-requests/{id}/attachments` | Вложение |
| POST | `/api/purchase-requests/{id}/supplier-order` | Заказ поставщику |

## Структура

```
tnsu-Inventory/
├── backend/
├── frontend/
├── spfx/
├── scripts/
│   └── test-notification.sh   # тест каналов уведомлений
├── docker-compose.yml
└── README.md
```

## Уведомления

Отдельной CLI-команды «отправить уведомление» нет. Backend шлёт их автоматически при действиях в workflow или через SLA-монитор (каждые 6 часов).

### Каналы и приоритет

| Условие | Куда уходит |
|---------|-------------|
| Задан `POWER_AUTOMATE_FLOW_URL` | Только Power Automate |
| Power Automate не настроен | SMTP + Teams webhook |

### События, которые отправляют уведомления

| Действие | Статус / тип |
|----------|--------------|
| `POST /api/defect-acts/{id}/submit` | На согласовании |
| `POST /api/purchase-requests/{id}/submit` | На согласовании |
| `POST /api/approvals/{stepId}/approve` (следующий шаг) | На согласовании |
| `POST /api/approvals/{stepId}/approve` (финал) | Согласовано |
| `POST /api/approvals/{stepId}/return` | Возврат на доработку |
| `POST /api/approvals/{stepId}/reject` | Отклонено |
| SLA-монитор (фон) | Напоминание / эскалация |

### Переменные окружения (`.env`)

```bash
# Email (prod — portal@tnsu.kz; локально по умолчанию Mailhog)
NOTIFICATIONS_EMAIL_HOST=smtp.office365.com
NOTIFICATIONS_EMAIL_PORT=587
NOTIFICATIONS_EMAIL_USE_STARTTLS=true
NOTIFICATIONS_EMAIL_USERNAME=portal@tnsu.kz
NOTIFICATIONS_EMAIL_PASSWORD=
NOTIFICATIONS_EMAIL_FROM=portal@tnsu.kz

# Power Automate (если задан — заменяет SMTP + Teams)
POWER_AUTOMATE_FLOW_URL=
POWER_AUTOMATE_TENANT_ID=
POWER_AUTOMATE_CLIENT_ID=
POWER_AUTOMATE_CLIENT_SECRET=
POWER_AUTOMATE_SCOPE=https://service.flow.microsoft.com//.default

# Teams (если Power Automate не настроен)
TEAMS_WEBHOOK_URL=
```

### Скрипт для тестирования

Скрипт читает `.env` из корня проекта:

```bash
chmod +x scripts/test-notification.sh
./scripts/test-notification.sh help
```

| Команда | Описание |
|---------|----------|
| `./scripts/test-notification.sh email` | Тест SMTP (Mailhog локально) |
| `./scripts/test-notification.sh teams` | Adaptive Card в Teams |
| `./scripts/test-notification.sh powerautomate` | POST в Power Automate flow |
| `./scripts/test-notification.sh mailhog` | Список писем в Mailhog |
| `./scripts/test-notification.sh api-login` | JWT через dev-login |
| `./scripts/test-notification.sh api-inbox` | Входящие согласования |
| `./scripts/test-notification.sh api-submit` | Отправить акт на согласование |
| `./scripts/test-notification.sh api-approve` | Согласовать шаг |
| `./scripts/test-notification.sh api-return` | Вернуть на доработку |
| `./scripts/test-notification.sh api-reject` | Отклонить шаг |
| `./scripts/test-notification.sh health` | Проверка `/health` |

Примеры с параметрами:

```bash
STATUS="Согласовано" ./scripts/test-notification.sh powerautomate
DEFECT_ACT_ID="<guid>" ./scripts/test-notification.sh api-submit
STEP_ID="<guid>" ./scripts/test-notification.sh api-approve
EMAIL=pm@tansu.local ./scripts/test-notification.sh email
```

### Power Automate

Тело POST-запроса:

```json
{
  "email": "storekeeper@tansu.local",
  "linkURL": "https://.../defect-acts/{id}",
  "status": "На согласовании",
  "docNumber": "ДА-00001"
}
```

Допустимые значения `status`: `На согласовании`, `Согласовано`, `Отклонено`, `Возврат на доработку`.

```bash
export FLOW_URL="$POWER_AUTOMATE_FLOW_URL"
export EMAIL="storekeeper@tansu.local"
export LINK_URL="http://localhost:5173/defect-acts/00000000-0000-0000-0000-000000000001"
export DOC_NUMBER="ДА-00001"

# Простой HTTP POST URL (без OAuth)
curl -sS -X POST "$FLOW_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"linkURL\": \"$LINK_URL\",
    \"status\": \"На согласовании\",
    \"docNumber\": \"$DOC_NUMBER\"
  }"
```

Direct endpoint с OAuth:

```bash
export PA_TENANT_ID="$POWER_AUTOMATE_TENANT_ID"
export PA_CLIENT_ID="$POWER_AUTOMATE_CLIENT_ID"
export PA_CLIENT_SECRET="$POWER_AUTOMATE_CLIENT_SECRET"
export PA_SCOPE="https://service.flow.microsoft.com//.default"

TOKEN=$(curl -sS -X POST "https://login.microsoftonline.com/${PA_TENANT_ID}/oauth2/v2.0/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=${PA_CLIENT_ID}" \
  -d "client_secret=${PA_CLIENT_SECRET}" \
  -d "scope=${PA_SCOPE}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

curl -sS -X POST "$FLOW_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"linkURL\": \"$LINK_URL\",
    \"status\": \"Согласовано\",
    \"docNumber\": \"$DOC_NUMBER\"
  }"
```

### Microsoft Teams

```bash
export TEAMS_WEBHOOK_URL="https://..."

curl -sS -X POST "$TEAMS_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "message",
    "attachments": [{
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "type": "AdaptiveCard",
        "version": "1.4",
        "body": [
          { "type": "TextBlock", "text": "Тест: ДА-00001", "weight": "Bolder", "size": "Medium" },
          { "type": "TextBlock", "text": "Проверка уведомления", "wrap": true }
        ],
        "actions": [{
          "type": "Action.OpenUrl",
          "title": "Открыть документ",
          "url": "http://localhost:5173/defect-acts/00000000-0000-0000-0000-000000000001"
        }]
      }
    }]
  }'
```

### Email (SMTP / Mailhog)

Локально (Docker): SMTP `localhost:1027`, UI http://localhost:8027.

```bash
# Через swaks (brew install swaks)
swaks --to storekeeper@tansu.local \
  --from portal@tnsu.kz \
  --server localhost \
  --port 1027 \
  --header "Subject: Тест: согласование ДА-00001" \
  --body "На согласовании 1 раб. дн.\nhttp://localhost:5173/defect-acts/..."

# Посмотреть письма в Mailhog
open http://localhost:8027
curl -sS http://localhost:8027/api/v2/messages | python3 -m json.tool
```

Prod SMTP (Office 365):

```bash
swaks --to storekeeper@tansu.local \
  --from portal@tnsu.kz \
  --server smtp.office365.com \
  --port 587 \
  --tls \
  --auth LOGIN \
  --auth-user portal@tnsu.kz \
  --auth-password "$NOTIFICATIONS_EMAIL_PASSWORD" \
  --header "Subject: Тест уведомления" \
  --body "Тестовое письмо"
```

### Через API (реальные уведомления из backend)

```bash
export API="http://localhost:8081"

# Dev-login (Development)
TOKEN=$(curl -sS -X POST "$API/api/auth/dev-login" \
  -H "Content-Type: application/json" \
  -d '{"email":"mechanic@tansu.local"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])")

# Входящие (узнать stepId)
curl -sS "$API/api/approvals/inbox" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool

# Отправить дефектный акт на согласование
curl -sS -X POST "$API/api/defect-acts/{id}/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Согласовать шаг
curl -sS -X POST "$API/api/approvals/{stepId}/approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment":"OK"}'

# Вернуть на доработку
curl -sS -X POST "$API/api/approvals/{stepId}/return" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment":"Нужна доработка"}'

# Отклонить
curl -sS -X POST "$API/api/approvals/{stepId}/reject" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment":"Отклонено"}'
```

Без JWT (локальный `dotnet run`):

```bash
curl -sS "$API/api/approvals/inbox" \
  -H "X-Dev-User-Email: storekeeper@tansu.local"
```

Логи отправки:

```bash
docker compose logs -f api
```

## Интеграции

**Печатные формы** — `GET /api/defect-acts/{id}/print`, `GET /api/purchase-requests/{id}/print`.

**Вложения** — `POST /api/purchase-requests/{id}/attachments`, SharePoint при `SharePoint:Enabled=true`.

**Power Automate** — `Notifications:PowerAutomate:FlowUrl` (`POWER_AUTOMATE_FLOW_URL`). Подробнее — раздел [Уведомления](#уведомления).

**Teams** — Adaptive Card при `Teams:WebhookUrl` (если Power Automate не настроен).

**Email** — через `Notifications:Email` (`NOTIFICATIONS_EMAIL_*` в `.env`, учётка `portal@tnsu.kz`). Локально — Mailhog.

**Заказ поставщику** — `POST /api/purchase-requests/{id}/supplier-order`, интеграция с `Procurement:BaseUrl`.

**Справочники 1С** — проекты, техника, разделы, виды работ, номенклатура, контрагенты. При недоступности API — резервные данные.
