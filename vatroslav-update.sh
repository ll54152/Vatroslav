#!/bin/bash

set -e

echo "Pulling latest code..."
cd ~/Vatroslav
git pull

echo "Building frontend..."
cd ~/Vatroslav/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/vatroslav

echo "Building backend..."
cd ~/Vatroslav/backend
mvn clean package

echo "Restarting backend..."
sudo systemctl restart vatroslav-backend

echo "Deploy complete!"