#!/bin/bash

# TCW1 Deployment Script to Azure App Service
# Usage: bash deploy.sh <backend|frontend|both>

set -e

RESOURCE_GROUP="tcw1-rg"
BACKEND_APP="tcw1-backend"
FRONTEND_APP="tcw1-frontend"
LOCATION="eastus"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========== TCW1 Azure Deployment Script ==========${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI not found. Install from: https://docs.microsoft.com/cli/azure/install-azure-cli${NC}"
    exit 1
fi

# Login to Azure
echo -e "${BLUE}Logging into Azure...${NC}"
az login

# Create resource group if it doesn't exist
echo -e "${BLUE}Creating resource group: $RESOURCE_GROUP${NC}"
az group create --name $RESOURCE_GROUP --location $LOCATION || true

# Deploy Backend
deploy_backend() {
    echo -e "${BLUE}Deploying Backend...${NC}"
    
    cd backend
    
    # Install dependencies
    npm ci
    
    # Build TypeScript
    npm run build
    
    # Create deployment package
    zip -r ../backend-deploy.zip dist/ node_modules/ package*.json
    
    cd ..
    
    # Deploy to Azure
    az webapp deployment source config-zip \
        --resource-group $RESOURCE_GROUP \
        --name $BACKEND_APP \
        --src backend-deploy.zip
    
    echo -e "${GREEN}✓ Backend deployed to https://${BACKEND_APP}.azurewebsites.net${NC}"
}

# Deploy Frontend
deploy_frontend() {
    echo -e "${BLUE}Deploying Frontend...${NC}"
    
    cd frontend
    
    # Install dependencies
    npm ci
    
    # Build React app
    npm run build
    
    # Create deployment package
    zip -r ../frontend-deploy.zip dist/ node_modules/ package*.json
    
    cd ..
    
    # Deploy to Azure
    az webapp deployment source config-zip \
        --resource-group $RESOURCE_GROUP \
        --name $FRONTEND_APP \
        --src frontend-deploy.zip
    
    echo -e "${GREEN}✓ Frontend deployed to https://${FRONTEND_APP}.azurewebsites.net${NC}"
}

# Main deployment logic
case "${1:-both}" in
    backend)
        deploy_backend
        ;;
    frontend)
        deploy_frontend
        ;;
    both)
        deploy_backend
        deploy_frontend
        ;;
    *)
        echo -e "${RED}Usage: bash deploy.sh <backend|frontend|both>${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}========== Deployment Complete! ==========${NC}"
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Update Cloudflare DNS records"
echo "2. Set environment variables in Azure Portal"
echo "3. Configure SSL certificate"
echo "4. Test your deployment: curl https://tcw1-backend.azurewebsites.net/health"
