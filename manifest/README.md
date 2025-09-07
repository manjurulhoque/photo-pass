# Photo Pass Kubernetes Manifests

This directory contains Kubernetes manifests for deploying the Photo Pass application.

## Architecture

The application consists of:
- **Backend**: FastAPI service running on port 8000
- **Frontend**: Next.js application running on port 3000
- **Storage**: Persistent volumes for uploads and processed images
- **Ingress**: Nginx ingress controller for external access

## Prerequisites

1. Kubernetes cluster (1.20+)
2. Nginx Ingress Controller installed
3. Metrics Server for HPA functionality
4. Docker images built and available

## Quick Start

### 1. Build Docker Images

```bash
# Build backend image
cd backend
docker build -t photo-pass-backend:latest .

# Build frontend image
cd ../frontend
docker build -t photo-pass-backend:latest .
```

### 2. Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -k .

# Or apply individually
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f storage-class.yaml
kubectl apply -f persistent-volumes.yaml
kubectl apply -f persistent-volume-claims.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa-backend.yaml
kubectl apply -f hpa-frontend.yaml
kubectl apply -f network-policy.yaml
```

### 3. Verify Deployment

```bash
# Check namespace
kubectl get namespace photo-pass

# Check pods
kubectl get pods -n photo-pass

# Check services
kubectl get services -n photo-pass

# Check ingress
kubectl get ingress -n photo-pass
```

## Configuration

### Environment Variables

Update `configmap.yaml` and `secret.yaml` with your actual values:

```bash
# Generate base64 encoded secrets
echo -n "your-secret-key" | base64
echo -n "your-database-url" | base64
```

### Host Configuration

Update `ingress.yaml` with your actual domain names:

```yaml
- host: your-domain.com
- host: api.your-domain.com
```

### Storage

The manifests use local storage. For production, consider:
- Cloud storage (AWS EBS, GCP PD, Azure Disk)
- Network storage (NFS, Ceph)
- Update `storage-class.yaml` accordingly

## Scaling

The application includes Horizontal Pod Autoscalers:
- Backend: 2-10 replicas based on CPU/Memory
- Frontend: 2-5 replicas based on CPU/Memory

## Security

- Network policies restrict inter-pod communication
- Secrets store sensitive configuration
- Ingress includes CORS configuration

## Monitoring

Check application health:
```bash
# Backend health
kubectl exec -n photo-pass deployment/photo-pass-backend -- curl http://localhost:8000/health

# Frontend health
kubectl exec -n photo-pass deployment/photo-pass-frontend -- curl http://localhost:3000/
```

## Troubleshooting

### Common Issues

1. **Images not found**: Ensure Docker images are built and available
2. **Storage issues**: Check PV/PVC status and host paths
3. **Ingress not working**: Verify Nginx Ingress Controller is installed
4. **HPA not scaling**: Ensure Metrics Server is running

### Logs

```bash
# Backend logs
kubectl logs -n photo-pass deployment/photo-pass-backend

# Frontend logs
kubectl logs -n photo-pass deployment/photo-pass-frontend
```

## Cleanup

```bash
# Remove all resources
kubectl delete -k .

# Or remove individually
kubectl delete namespace photo-pass
```
