#!/usr/bin/env bash

# LocalStack Configuration

# Project Root Directory
export ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../" && pwd)"

# DataCollection Module
export DATA_COLLECTION_DIR="$ROOT_DIR/PoliTopicsDataCollection"
export DATA_COLLECTION_BUILD_CMD="npm --prefix \"$DATA_COLLECTION_DIR\" run build"
export DATA_COLLECTION_TF_DIR="$DATA_COLLECTION_DIR/terraform"
export DATA_COLLECTION_CREATE_STATE_SCRIPT="$DATA_COLLECTION_TF_DIR/scripts/create-state-bucket.sh"
export DATA_COLLECTION_IMPORT_SCRIPT="$DATA_COLLECTION_TF_DIR/scripts/import_all.sh"

# Recap Module
export RECAP_DIR="$ROOT_DIR/PoliTopicsRecap"
export RECAP_BUILD_CMD="npm --prefix \"$RECAP_DIR\" run build:local"
export RECAP_TF_DIR="$RECAP_DIR/terraform"
export RECAP_CREATE_STATE_SCRIPT="$RECAP_TF_DIR/scripts/create-state-bucket.sh"
export RECAP_IMPORT_SCRIPT="$RECAP_TF_DIR/scripts/import_all.sh"

# Web Module
export WEB_DIR="$ROOT_DIR/PoliTopicsWeb"
export WEB_BUILD_CMD="npm --prefix \"$WEB_DIR\" run build:local:backend"
export WEB_TF_DIR="$WEB_DIR/terraform"
export WEB_CREATE_STATE_SCRIPT="$WEB_TF_DIR/scripts/create-state-bucket.sh"
export WEB_IMPORT_SCRIPT="$WEB_TF_DIR/scripts/import_all.sh"
