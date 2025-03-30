#!/bin/bash
set -e

if [ ! -d "/var/www/html" ]; then
    echo "Error: /var/www/html directory does not exist"
    exit 1
fi

sudo rm -rf /var/www/html/*
sudo cp -r * /var/www/html/

git add .
git commit --allow-empty-message -m ""
git push -u origin main || git push -u lzt404.github.io main

