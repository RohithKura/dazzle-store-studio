#!/bin/bash

# Build the app
npm run build

# Create directory in Apache's web root (requires sudo)
sudo mkdir -p /var/www/html/dazzle-store

# Copy the built files to Apache's directory
sudo cp -r dist/* /var/www/html/dazzle-store/

# Copy Apache configuration
sudo cp apache.conf /etc/apache2/sites-available/dazzle-store.conf

# Enable the site
sudo a2ensite dazzle-store.conf

# Enable required Apache modules
sudo a2enmod rewrite
sudo a2enmod headers

# Restart Apache
sudo systemctl restart apache2

echo "Deployment complete! Please add 'dazzle-store.local' to your /etc/hosts file:"
echo "127.0.0.1 dazzle-store.local"