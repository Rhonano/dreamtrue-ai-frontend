#!/bin/bash

# DreamTrue AI Frontend - CI/CD Deployment Script
# This script is designed for automated deployments via Cloud Build

set -e

# Configuration from environment variables
PROJECT_ID=${PROJECT_ID}
REGION=${REGION:-"us-central1"}
SERVICE_NAME="dreamtrue-ai-frontend"
COMMIT_SHA=${COMMIT_SHA:-$(git rev-parse HEAD)}
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting CI/CD deployment for DreamTrue AI Frontend"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Commit SHA: $COMMIT_SHA"

# Build and push with Cloud Build
echo "🏗️ Building and pushing with Cloud Build..."
gcloud builds submit \
    --config cloudbuild.yaml \
    --substitutions _CLOUDSQL_INSTANCE="$CLOUDSQL_INSTANCE" \
    .

echo "✅ CI/CD deployment completed!"
