#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/localstack_config.sh"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd terraform
require_cmd npm
require_cmd aws

# Parse arguments
INCLUDE_MODULES=""
while [[ $# -gt 0 ]]; do
  case $1 in
    -only)
      INCLUDE_MODULES="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

should_run() {
  local module_name="$1"
  if [[ -z "$INCLUDE_MODULES" ]]; then
    return 0
  fi
  
  # Convert both to lowercase for case-insensitive comparison
  local inc_lower=$(echo "$INCLUDE_MODULES" | tr '[:upper:]' '[:lower:]')
  local name_lower=$(echo "$module_name" | tr '[:upper:]' '[:lower:]')
  
  if [[ ",$inc_lower," == *",$name_lower,"* ]]; then
    return 0
  else
    return 1
  fi
}

run_step() {
  local label="$1"
  shift
  echo
  echo "==> ${label}"
  "$@"
}

run_module() {
  local name="$1"
  local module_dir="$2"
  local build_cmd="$3"
  local tf_dir="$4"
  local create_state_script="$5"
  local import_script="$6"

  if ! should_run "$name"; then
    echo "Skipping $name (not included in -only)"
    return
  fi

  run_step "${name}: build" bash -c "$build_cmd"
  run_step "${name}: create state bucket" "$create_state_script" local
  run_step "${name}: terraform init" terraform -chdir="$tf_dir" init -input=false
  run_step "${name}: import" "$import_script" local

  echo
  echo "==> ${name}: terraform plan"
  set +e
  terraform -chdir="$tf_dir" plan -detailed-exitcode -var-file="tfvars/localstack.tfvars" -out=tfplan
  PLAN_EXIT_CODE=$?
  set -e

  if [ $PLAN_EXIT_CODE -eq 0 ]; then
    echo "No changes detected. Skipping apply."
  elif [ $PLAN_EXIT_CODE -eq 2 ]; then
    echo "Changes detected. Proceeding with apply."
    run_step "${name}: terraform apply" terraform -chdir="$tf_dir" apply -input=false "tfplan"
  else
    echo "Terraform plan failed with exit code $PLAN_EXIT_CODE"
    exit $PLAN_EXIT_CODE
  fi
}

run_module \
  "DataCollection" \
  "$DATA_COLLECTION_DIR" \
  "$DATA_COLLECTION_BUILD_CMD" \
  "$DATA_COLLECTION_TF_DIR" \
  "$DATA_COLLECTION_CREATE_STATE_SCRIPT" \
  "$DATA_COLLECTION_IMPORT_SCRIPT"

run_module \
  "Recap" \
  "$RECAP_DIR" \
  "$RECAP_BUILD_CMD" \
  "$RECAP_TF_DIR" \
  "$RECAP_CREATE_STATE_SCRIPT" \
  "$RECAP_IMPORT_SCRIPT"

run_module \
  "Web" \
  "$WEB_DIR" \
  "$WEB_BUILD_CMD" \
  "$WEB_TF_DIR" \
  "$WEB_CREATE_STATE_SCRIPT" \
  "$WEB_IMPORT_SCRIPT"
