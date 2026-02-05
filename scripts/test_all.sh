#!/usr/bin/env bash
set -e

# Define directories to run tests in
DIRECTORIES=("PoliTopicsDataCollection" "PoliTopicsRecap" "PoliTopicsWeb")

# Store the root directory
# The script is in /scripts, so the root is two levels up
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

echo "Starting tests for all submodules..."

ENV_FILE="${HOME}/.politopics_env"
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

if [ -z "${NODE_AUTH_TOKEN:-}" ]; then
  echo "NODE_AUTH_TOKEN is not set. Please enter it to proceed."
  read -r -s -p "NODE_AUTH_TOKEN: " NODE_AUTH_TOKEN
  echo
  export NODE_AUTH_TOKEN
  umask 177
  printf 'export NODE_AUTH_TOKEN=%q\n' "$NODE_AUTH_TOKEN" > "$ENV_FILE"
fi

for dir in "${DIRECTORIES[@]}"; do
  if [ -d "$ROOT_DIR/$dir" ]; then
    echo "--------------------------------------------------"
    echo "Running tests in $dir..."
    echo "--------------------------------------------------"
    cd "$ROOT_DIR/$dir"

    # Ensure Jest cache directory is writable (avoid /tmp permission issues)
    export JEST_CACHE_DIR="$ROOT_DIR/.jest-cache/$dir"
    mkdir -p "$JEST_CACHE_DIR"

    # Check if package.json exists
    if [ -f "package.json" ]; then
        # Check if test script exists in package.json
        if grep -q '"test":' package.json; then
             npm test
        else
             echo "No test script found in $dir/package.json. Skipping..."
        fi
    else
        echo "No package.json found in $dir. Skipping..."
    fi

    cd "$ROOT_DIR"
  else
    echo "Directory $dir not found. Skipping..."
  fi
done

echo "--------------------------------------------------"
echo "All tests completed successfully."
