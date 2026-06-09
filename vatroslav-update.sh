#!/bin/bash

set -e

echo "Pulling latest code..."
git pull

echo "Building frontend..."
cd ~/Vatroslav/frontend
npm ci
npm audit fix
npm run build
sudo cp -r dist/* /var/www/html/vatroslav

echo "Building backend..."
cd ~/Vatroslav/backend
mvn clean package

echo "Restarting backend..."
sudo systemctl restart vatroslav-backend

echo "Deploy complete!"
