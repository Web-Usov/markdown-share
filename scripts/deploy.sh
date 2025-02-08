#!/bin/bash

# Load environment variables from .env file
set -a
source .env
set +a

# Check if source directory exists
if [ ! -d "src" ]; then
    echo "Error: src directory not found!"
    exit 1
fi

# Create a temporary directory for rsync
ssh $SSH_URL "mkdir -p $SSH_DIRECTORY"

# Sync all files from src directory to remote server
rsync -avz --delete ./src/ $SSH_URL:$SSH_DIRECTORY/

echo "Deployment completed successfully!"
