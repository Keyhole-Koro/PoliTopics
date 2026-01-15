#!/usr/bin/env bash
set -euo pipefail

# Quick LocalStack smoke test (and optional auto-apply) for module infra.
# Usage: ./scripts/verify_localstack_resources.sh [-only DataCollection,Recap,Web] [--ensure]

only_raw=""
ENSURE=false
if [[ "${1:-}" == "-only" && "${2:-}" != "" ]]; then
  only_raw="$2"
  shift 2
elif [[ "${1:-}" == "-only="* ]]; then
  only_raw="${1#-only=}"
  shift
fi

for arg in "$@"; do
  case "$arg" in
    --ensure)
      ENSURE=true
      ;;
  esac
done

IFS=',' read -ra ONLY_MODULES <<< "$only_raw"

should_check_module() {
  local target="$1"
  if [[ ${#ONLY_MODULES[@]} -eq 0 ]]; then
    return 0
  fi
  for m in "${ONLY_MODULES[@]}"; do
    if [[ "${m,,}" == "${target,,}" ]]; then
      return 0
    fi
  done
  return 1
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd aws

check_module() {
  local module="$1"
  local script=""
  case "$module" in
    DataCollection) script="./PoliTopicsDataCollection/scripts/ensure-localstack.sh" ;;
    Recap) script="./PoliTopicsRecap/scripts/ensure-localstack.sh" ;;
    Web) script="./PoliTopicsWeb/scripts/ensure-localstack.sh" ;;
    *)
      echo "Unknown module: $module" >&2
      return 1
      ;;
  esac
  if [[ ! -x "$script" ]]; then
    echo "[ERROR] ensure-localstack script not found for $module ($script)" >&2
    return 1
  fi
  if "$script" --check-only; then
    return 0
  else
    echo "[WARN] $module resources missing."
    return 1
  fi
}

ensure_module() {
  local module="$1"
  local script=""
  case "$module" in
    DataCollection) script="./PoliTopicsDataCollection/scripts/ensure-localstack.sh" ;;
    Recap) script="./PoliTopicsRecap/scripts/ensure-localstack.sh" ;;
    Web) script="./PoliTopicsWeb/scripts/ensure-localstack.sh" ;;
  esac
  if [[ -z "$script" || ! -x "$script" ]]; then
    echo "[ERROR] ensure-localstack script not found for $module ($script)" >&2
    return 1
  fi
  echo "[ensure] Running $script ..."
  "$script"
}

overall_failures=0
modules=("DataCollection" "Recap" "Web")

for module in "${modules[@]}"; do
  if ! should_check_module "$module"; then
    continue
  fi
  if check_module "$module"; then
    continue
  fi
  if $ENSURE; then
    if ensure_module "$module"; then
      # Re-check after apply
      if check_module "$module"; then
        continue
      fi
    fi
  fi
  overall_failures=$((overall_failures + 1))
done

echo
if [[ $overall_failures -eq 0 ]]; then
  echo "All selected modules verified."
else
  echo "$overall_failures module(s) failed verification."
  exit 1
fi
