#!/usr/bin/env bash
set -e

# Define directories to run tests in
DIRECTORIES=("PoliTopicsDataCollection" "PoliTopicsRecap" "PoliTopicsWeb")

# Store the root directory
# The script is in /scripts, so the root is two levels up
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

echo "Starting tests for all submodules..."

for dir in "${DIRECTORIES[@]}"; do
  if [ -d "$ROOT_DIR/$dir" ]; then
    echo "--------------------------------------------------"
    echo "Running tests in $dir..."
    echo "--------------------------------------------------"
    cd "$ROOT_DIR/$dir"
    
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
