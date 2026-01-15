#!/usr/bin/env bash

# Source this script to export test-friendly environment variables for all modules.
# Defaults target LocalStack at http://localstack:4566; prompts for secrets to keep them out of git history.

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  script_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
  echo "Please source this script instead of executing it: source ${script_path}"
  exit 1
fi

PROMPT_CACHE_FILE="${EXPORT_TEST_ENV_CACHE:-${HOME}/.config/politopics/export_test_env.cache}"

prompt_with_default() {
  local var_name="$1"
  local prompt="$2"
  local current_value="${!var_name}"
  local has_current_value="${!var_name+x}"
  local input
  read -r -p "${prompt} (${current_value}): " input
  if [ -z "$input" ]; then
    if [ -n "$has_current_value" ]; then
      export "${var_name}=${current_value}"
    fi
    return
  fi
  export "${var_name}=${input}"
}

load_prompt_cache() {
  local cache_file="$1"
  if [ -f "$cache_file" ]; then
    # shellcheck disable=SC1090
    . "$cache_file"
  fi
}

save_prompt_cache() {
  local cache_file="$1"
  local dir
  dir="$(dirname "$cache_file")"
  mkdir -p "$dir"
  ( umask 077
    {
      echo "# Cached prompt values for export_test_env.sh (not tracked in git)"
      for var in RUN_API_KEY DISCORD_WEBHOOK_ERROR DISCORD_WEBHOOK_WARN DISCORD_WEBHOOK_BATCH DISCORD_WEBHOOK_ACCESS; do
        if [ -n "${!var+x}" ]; then
          printf ': "${%s:=%s}"\n' "$var" "$(printf '%q' "${!var}")"
        fi
      done
    } >"$cache_file"
  )
}

load_prompt_cache "$PROMPT_CACHE_FILE"

export LOCALSTACK_URL="http://localstack:4566"
export LOCALSTACK_ENDPOINT_URL="$LOCALSTACK_URL"
export AWS_ENDPOINT_URL="$LOCALSTACK_URL"
export AWS_REGION="ap-northeast-3"
export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"

# DataCollection / Recap shared
export APP_ENVIRONMENT="local"
export GEMINI_API_KEY="fake-gemini-key"
export RUN_LOCALSTACK_TESTS="true"

# Prompted secrets/webhooks
prompt_with_default RUN_API_KEY "RUN_API_KEY"
prompt_with_default NODE_AUTH_TOKEN "NODE_AUTH_TOKEN"
prompt_with_default DISCORD_WEBHOOK_ERROR "DISCORD_WEBHOOK_ERROR"
prompt_with_default DISCORD_WEBHOOK_WARN "DISCORD_WEBHOOK_WARN"
prompt_with_default DISCORD_WEBHOOK_BATCH "DISCORD_WEBHOOK_BATCH"

# Web backend
export ACTIVE_ENVIRONMENT="local"
prompt_with_default DISCORD_WEBHOOK_ACCESS "DISCORD_WEBHOOK_ACCESS"

# Web frontend
export NEXT_PUBLIC_APP_ENV="local"
export NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"

save_prompt_cache "$PROMPT_CACHE_FILE"

echo "Exported test env vars for DataCollection/Recap/Web -> LocalStack: ${LOCALSTACK_URL}"
echo "APP_ENVIRONMENT=${APP_ENVIRONMENT} | ACTIVE_ENVIRONMENT=${ACTIVE_ENVIRONMENT} | RUN_LOCALSTACK_TESTS=${RUN_LOCALSTACK_TESTS}"
