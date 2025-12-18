#!/usr/bin/env bash
set -euo pipefail

ROOT="/workspaces/PoliTopics"

echo "Bootstrapping PoliTopics monorepo dependencies..."

if [ -d "$ROOT/PoliTopicsWeb" ]; then
  echo "Installing PoliTopicsWeb workspaces"
  cd "$ROOT/PoliTopicsWeb"
  npm install --workspaces --include-workspace-root
fi

if [ -d "$ROOT/PoliTopicsRecap" ]; then
  echo "Installing PoliTopicsRecap dependencies"
  cd "$ROOT/PoliTopicsRecap"
  pnpm install
fi

if [ -d "$ROOT/PoliTopicsDataCollection" ]; then
  echo "Installing PoliTopicsDataCollection dependencies"
  cd "$ROOT/PoliTopicsDataCollection"
  pnpm install
fi

echo "Bootstrap complete."
