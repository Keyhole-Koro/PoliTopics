#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: commit_and_push_all.sh -m "message" [--all] [--no-push] [--dry-run]

  -m, --message   Commit message (required)
  --all           Stage all changes (git add -A) before commit
  --no-push       Skip git push
  --dry-run       Show actions without modifying repos
USAGE
}

commit_message=""
stage_all=false
no_push=false
dry_run=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--message)
      commit_message="${2:-}"
      shift 2
      ;;
    --all)
      stage_all=true
      shift
      ;;
    --no-push)
      no_push=true
      shift
      ;;
    --dry-run)
      dry_run=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$commit_message" ]]; then
  echo "Commit message is required." >&2
  usage
  exit 1
fi

mapfile -d '' repos < <(find . -name .git -type d -print0)
if [[ ${#repos[@]} -eq 0 ]]; then
  echo "No git repositories found."
  exit 0
fi

for gitdir in "${repos[@]}"; do
  repo_dir="${gitdir%/.git}"
  echo "==> ${repo_dir}"

  status=$(git -C "$repo_dir" status --porcelain)
  if [[ -z "$status" ]]; then
    echo "  clean, skip"
    continue
  fi

  if $stage_all; then
    if $dry_run; then
      echo "  [dry-run] git add -A"
    else
      git -C "$repo_dir" add -A
    fi
  fi

  if git -C "$repo_dir" diff --cached --quiet; then
    echo "  no staged changes, skip"
    continue
  fi

  if $dry_run; then
    echo "  [dry-run] git commit -m \"$commit_message\""
  else
    git -C "$repo_dir" commit -m "$commit_message"
  fi

  if $no_push; then
    echo "  push skipped"
    continue
  fi

  if $dry_run; then
    echo "  [dry-run] git push"
  else
    git -C "$repo_dir" push
  fi

done
