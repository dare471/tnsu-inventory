#!/usr/bin/env bash
# Тестирование каналов уведомлений: Power Automate, Teams, SMTP, API.
# Использование: ./scripts/test-notification.sh --help

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env}"

load_dotenv() {
  local file="$1"
  [[ -f "$file" ]] || return 0

  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%$'\r'}"
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^[[:space:]]*export[[:space:]]+ ]] && line="${line#export }"
    [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]] || continue

    local key="${BASH_REMATCH[1]}"
    local val="${BASH_REMATCH[2]}"
    if [[ "$val" =~ ^\"(.*)\"$ ]]; then
      val="${BASH_REMATCH[1]}"
    elif [[ "$val" =~ ^\'(.*)\'$ ]]; then
      val="${BASH_REMATCH[1]}"
    fi
    export "$key=$val"
  done < "$file"
}

load_dotenv "$ENV_FILE"

API="${API:-http://localhost:8081}"
EMAIL="${EMAIL:-storekeeper@tansu.local}"
LINK_URL="${LINK_URL:-${FRONTEND_BASE_URL:-http://localhost:5173}/defect-acts/00000000-0000-0000-0000-000000000001}"
DOC_NUMBER="${DOC_NUMBER:-ДА-00001}"
STATUS="${STATUS:-На согласовании}"
DEV_USER_EMAIL="${DEV_USER_EMAIL:-mechanic@tansu.local}"
DEFECT_ACT_ID="${DEFECT_ACT_ID:-}"
STEP_ID="${STEP_ID:-}"
SMTP_HOST="${NOTIFICATIONS_EMAIL_HOST:-mailhog}"
SMTP_PORT="${NOTIFICATIONS_EMAIL_PORT:-1025}"
SMTP_FROM="${NOTIFICATIONS_EMAIL_FROM:-portal@tnsu.kz}"
SMTP_USE_TLS="${NOTIFICATIONS_EMAIL_USE_STARTTLS:-false}"
SMTP_USER="${NOTIFICATIONS_EMAIL_USERNAME:-}"
SMTP_PASS="${NOTIFICATIONS_EMAIL_PASSWORD:-}"
FLOW_URL="${POWER_AUTOMATE_FLOW_URL:-}"
TEAMS_WEBHOOK_URL="${TEAMS_WEBHOOK_URL:-}"
PA_TENANT_ID="${POWER_AUTOMATE_TENANT_ID:-}"
PA_CLIENT_ID="${POWER_AUTOMATE_CLIENT_ID:-}"
PA_CLIENT_SECRET="${POWER_AUTOMATE_CLIENT_SECRET:-}"
PA_SCOPE="${POWER_AUTOMATE_SCOPE:-https://service.flow.microsoft.com//.default}"
MAILHOG_UI="${MAILHOG_UI:-http://localhost:${MAILHOG_UI_PORT:-8027}}"

usage() {
  cat <<'EOF'
Тестирование уведомлений TNSU Inventory.

Использование:
  ./scripts/test-notification.sh <команда> [опции]

Команды:
  powerautomate   POST в Power Automate flow
  teams           Adaptive Card в Teams webhook
  email           Тестовое письмо через SMTP (локально — Mailhog)
  mailhog         Список писем в Mailhog
  api-login       Получить JWT через dev-login
  api-inbox       Входящие согласования
  api-submit      Отправить дефектный акт на согласование
  api-approve     Согласовать шаг
  api-return      Вернуть на доработку
  api-reject      Отклонить шаг
  health          Проверка API /health
  help            Эта справка

Переменные окружения (или .env в корне проекта):
  API, EMAIL, LINK_URL, DOC_NUMBER, STATUS
  POWER_AUTOMATE_FLOW_URL, TEAMS_WEBHOOK_URL
  NOTIFICATIONS_EMAIL_* , POWER_AUTOMATE_*
  DEFECT_ACT_ID, STEP_ID, DEV_USER_EMAIL, TOKEN

Примеры:
  ./scripts/test-notification.sh email
  ./scripts/test-notification.sh teams
  STATUS="Согласовано" ./scripts/test-notification.sh powerautomate
  DEFECT_ACT_ID="<guid>" ./scripts/test-notification.sh api-submit
  STEP_ID="<guid>" ./scripts/test-notification.sh api-approve

Допустимые STATUS для Power Automate:
  На согласовании | Согласовано | Отклонено | Возврат на доработку
EOF
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Ошибка: не найдена команда '$1'" >&2
    exit 1
  fi
}

json_get() {
  local expr="$1"
  python3 -c "import sys,json; print(json.load(sys.stdin)${expr})"
}

get_token() {
  if [[ -n "${TOKEN:-}" ]]; then
    echo "$TOKEN"
    return
  fi

  require_cmd curl
  curl -sS -X POST "$API/api/auth/dev-login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$DEV_USER_EMAIL\"}" \
    | json_get "['accessToken']"
}

get_powerautomate_token() {
  require_cmd curl
  curl -sS -X POST "https://login.microsoftonline.com/${PA_TENANT_ID}/oauth2/v2.0/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=client_credentials" \
    -d "client_id=${PA_CLIENT_ID}" \
    -d "client_secret=${PA_CLIENT_SECRET}" \
    -d "scope=${PA_SCOPE}" \
    | json_get "['access_token']"
}

cmd_health() {
  require_cmd curl
  curl -sS "$API/health"
  echo
}

cmd_powerautomate() {
  require_cmd curl

  if [[ -z "$FLOW_URL" ]]; then
    echo "Ошибка: задайте POWER_AUTOMATE_FLOW_URL в .env" >&2
    exit 1
  fi

  local auth_header=()
  if [[ -n "$PA_TENANT_ID" && -n "$PA_CLIENT_ID" && -n "$PA_CLIENT_SECRET" ]]; then
    local token
    token="$(get_powerautomate_token)"
    auth_header=(-H "Authorization: Bearer $token")
  fi

  curl -sS -X POST "$FLOW_URL" \
    "${auth_header[@]}" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$EMAIL\",
      \"linkURL\": \"$LINK_URL\",
      \"status\": \"$STATUS\",
      \"docNumber\": \"$DOC_NUMBER\"
    }"
  echo
}

cmd_teams() {
  require_cmd curl

  if [[ -z "$TEAMS_WEBHOOK_URL" ]]; then
    echo "Ошибка: задайте TEAMS_WEBHOOK_URL в .env" >&2
    exit 1
  fi

  curl -sS -X POST "$TEAMS_WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"type\": \"message\",
      \"attachments\": [{
        \"contentType\": \"application/vnd.microsoft.card.adaptive\",
        \"content\": {
          \"type\": \"AdaptiveCard\",
          \"version\": \"1.4\",
          \"body\": [
            { \"type\": \"TextBlock\", \"text\": \"Тест: $DOC_NUMBER\", \"weight\": \"Bolder\", \"size\": \"Medium\" },
            { \"type\": \"TextBlock\", \"text\": \"Проверка уведомления ($STATUS)\", \"wrap\": true }
          ],
          \"actions\": [{
            \"type\": \"Action.OpenUrl\",
            \"title\": \"Открыть документ\",
            \"url\": \"$LINK_URL\"
          }]
        }
      }]
    }"
  echo
}

cmd_email() {
  local subject="Тест: согласование $DOC_NUMBER"
  local body="Статус: $STATUS
$DOC_NUMBER
$LINK_URL"

  if command -v swaks >/dev/null 2>&1; then
    local tls_args=()
    local auth_args=()
    if [[ "$SMTP_USE_TLS" == "true" ]]; then
      tls_args=(--tls)
    fi
    if [[ -n "$SMTP_USER" && -n "$SMTP_PASS" ]]; then
      auth_args=(--auth LOGIN --auth-user "$SMTP_USER" --auth-password "$SMTP_PASS")
    fi

    swaks --to "$EMAIL" \
      --from "$SMTP_FROM" \
      --server "$SMTP_HOST" \
      --port "$SMTP_PORT" \
      "${tls_args[@]}" \
      "${auth_args[@]}" \
      --header "Subject: $subject" \
      --body "$body"
    return
  fi

  require_cmd curl
  curl -sS --mail-from "$SMTP_FROM" \
    --mail-rcpt "$EMAIL" \
    --url "smtp://${SMTP_HOST}:${SMTP_PORT}" \
    -T - <<EOF
From: $SMTP_FROM
To: $EMAIL
Subject: $subject

$body
EOF
  echo
}

cmd_mailhog() {
  require_cmd curl
  curl -sS "$MAILHOG_UI/api/v2/messages" | python3 -m json.tool
}

cmd_api_login() {
  get_token
  echo
}

cmd_api_inbox() {
  require_cmd curl
  local token
  token="$(get_token)"

  curl -sS "$API/api/approvals/inbox" \
    -H "Authorization: Bearer $token" \
    | python3 -m json.tool
}

cmd_api_submit() {
  require_cmd curl

  if [[ -z "$DEFECT_ACT_ID" ]]; then
    echo "Ошибка: задайте DEFECT_ACT_ID" >&2
    exit 1
  fi

  local token
  token="$(get_token)"

  curl -sS -X POST "$API/api/defect-acts/${DEFECT_ACT_ID}/submit" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    | python3 -m json.tool
}

cmd_api_approve() {
  require_cmd curl

  if [[ -z "$STEP_ID" ]]; then
    echo "Ошибка: задайте STEP_ID" >&2
    exit 1
  fi

  local token
  token="$(get_token)"

  curl -sS -X POST "$API/api/approvals/${STEP_ID}/approve" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d '{"comment":"OK"}'
  echo
}

cmd_api_return() {
  require_cmd curl

  if [[ -z "$STEP_ID" ]]; then
    echo "Ошибка: задайте STEP_ID" >&2
    exit 1
  fi

  local token
  token="$(get_token)"

  curl -sS -X POST "$API/api/approvals/${STEP_ID}/return" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d '{"comment":"Нужна доработка"}'
  echo
}

cmd_api_reject() {
  require_cmd curl

  if [[ -z "$STEP_ID" ]]; then
    echo "Ошибка: задайте STEP_ID" >&2
    exit 1
  fi

  local token
  token="$(get_token)"

  curl -sS -X POST "$API/api/approvals/${STEP_ID}/reject" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d '{"comment":"Отклонено"}'
  echo
}

main() {
  local command="${1:-help}"
  shift || true

  case "$command" in
    powerautomate|pa) cmd_powerautomate "$@" ;;
    teams) cmd_teams "$@" ;;
    email|smtp) cmd_email "$@" ;;
    mailhog) cmd_mailhog "$@" ;;
    api-login|login) cmd_api_login "$@" ;;
    api-inbox|inbox) cmd_api_inbox "$@" ;;
    api-submit|submit) cmd_api_submit "$@" ;;
    api-approve|approve) cmd_api_approve "$@" ;;
    api-return|return) cmd_api_return "$@" ;;
    api-reject|reject) cmd_api_reject "$@" ;;
    health) cmd_health "$@" ;;
    help|-h|--help) usage ;;
    *)
      echo "Неизвестная команда: $command" >&2
      usage
      exit 1
      ;;
  esac
}

main "$@"
