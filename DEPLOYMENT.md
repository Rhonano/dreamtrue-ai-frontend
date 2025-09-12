# DreamTrue AI Frontend - Cloud Run Deployment Guide

This guide covers deploying the DreamTrue AI frontend to Google Cloud Run with integration for Cloud Storage and Vertex AI.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cloud Run     │    │  Cloud Storage  │    │   Vertex AI     │
│   (Frontend)    │◄──►│   (Documents)   │◄──►│   (RAG/LLM)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Backend API   │
                    │   (Your API)    │
                    └─────────────────┘
```

## 📋 Prerequisites

1. **Google Cloud Project** with billing enabled
2. **gcloud CLI** installed and authenticated
3. **Docker** installed locally
4. **Required APIs enabled**:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API
   - Cloud Storage API
   - Vertex AI API

## 🚀 Quick Deployment

### Option 1: Manual Deployment

```bash
# Set your project ID
export PROJECT_ID="your-gcp-project-id"

# Run the deployment script
./deploy.sh
```

### Option 2: CI/CD Deployment

```bash
# Set environment variables
export PROJECT_ID="your-gcp-project-id"
export CLOUDSQL_INSTANCE="your-project:region:instance-name"  # Optional

# Run CI/CD deployment
./deploy-ci.sh
```

## ⚙️ Configuration

### 1. Update Environment Variables

Copy `env.example` to `.env.local` and update with your values:

```bash
cp env.example .env.local
```

Key variables to configure:
- `REACT_APP_PROJECT_ID`: Your GCP project ID
- `REACT_APP_BACKEND_API_URL`: Your backend API endpoint
- `REACT_APP_VERTEX_AI_PROJECT_ID`: Vertex AI project ID
- `REACT_APP_CLOUD_STORAGE_BUCKET`: Cloud Storage bucket name

### 2. Update Cloud Build Configuration

Edit `cloudbuild.yaml` and update:
- `_CLOUDSQL_INSTANCE`: Your Cloud SQL instance (if using)
- Region settings
- Resource limits

### 3. Update Service Configuration

Edit `service.yaml` and update:
- `PROJECT_ID`: Replace with your actual project ID
- Environment variables
- Resource limits
- VPC connector (if needed)

## 🔧 Advanced Configuration

### Cloud Storage Integration

1. **Create a Cloud Storage bucket**:
```bash
gsutil mb gs://your-bucket-name
```

2. **Set up CORS** for file uploads:
```bash
gsutil cors set cors.json gs://your-bucket-name
```

3. **Create service account** with Storage Object Admin role

### Vertex AI Integration

1. **Enable Vertex AI API**:
```bash
gcloud services enable aiplatform.googleapis.com
```

2. **Create service account** with Vertex AI User role

3. **Configure authentication** in your backend

### Custom Domain Setup

1. **Map custom domain** in Cloud Run console
2. **Update DNS records** to point to Cloud Run
3. **Configure SSL certificate** (automatic with Google-managed certificates)

## 📊 Monitoring & Logging

### View Logs
```bash
# Real-time logs
gcloud run logs tail dreamtrue-ai-frontend --region=us-central1

# Historical logs
gcloud run logs read dreamtrue-ai-frontend --region=us-central1 --limit=100
```

### Monitor Performance
- **Cloud Run Metrics**: CPU, memory, request count
- **Cloud Monitoring**: Custom dashboards
- **Error Reporting**: Automatic error tracking

## 🔒 Security Best Practices

### 1. IAM Configuration
- Use least-privilege service accounts
- Enable audit logging
- Configure VPC security groups

### 2. Container Security
- Non-root user in Dockerfile
- Regular base image updates
- Vulnerability scanning

### 3. Network Security
- VPC connector for private resources
- Cloud Armor for DDoS protection
- HTTPS enforcement

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Dockerfile syntax
   - Verify all dependencies in package.json
   - Review build logs in Cloud Build

2. **Deployment Failures**:
   - Verify service account permissions
   - Check resource quotas
   - Review Cloud Run logs

3. **Runtime Issues**:
   - Check environment variables
   - Verify health check endpoint
   - Review nginx configuration

### Debug Commands

```bash
# Test local build
docker build -t test-image .

# Test local container
docker run -p 8080:8080 test-image

# Check service status
gcloud run services describe dreamtrue-ai-frontend --region=us-central1

# View service configuration
gcloud run services describe dreamtrue-ai-frontend --region=us-central1 --format="export"
```

## 📈 Scaling Configuration

### Automatic Scaling
- **Min instances**: 0 (cost optimization)
- **Max instances**: 10 (adjust based on traffic)
- **Concurrency**: 100 requests per instance

### Performance Tuning
- **Memory**: 512Mi (adjust based on usage)
- **CPU**: 1 vCPU (adjust based on load)
- **Timeout**: 300 seconds

## 💰 Cost Optimization

1. **Set min instances to 0** for development
2. **Use appropriate memory/CPU limits**
3. **Enable request-based scaling**
4. **Monitor usage with Cloud Billing**

## 🔄 CI/CD Pipeline

### GitHub Actions Integration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: google-github-actions/setup-gcloud@v0
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      - run: ./deploy-ci.sh
```

## 📞 Support

For deployment issues:
1. Check Cloud Run logs
2. Review Cloud Build history
3. Verify IAM permissions
4. Contact your DevOps team

---

**Last Updated**: September 2024
**Version**: 1.0.0
