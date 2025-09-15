#!/bin/bash

# Add .js extension to local imports
find /home/rohith/dazzle-store-studio/backend -type f -name "*.js" -exec sed -i 's/from "\.\.\?\/\([^"]*\)"/from "\.\.\?\/\1\.js"/g' {} \;

# Rename all config files to .js
cd /home/rohith/dazzle-store-studio/backend/config
for file in *; do
  if [[ ! "$file" == *.js ]]; then
    mv "$file" "${file}.js"
  fi
done

# Rename all middleware files to .js
cd ../middleware
for file in *; do
  if [[ ! "$file" == *.js ]]; then
    mv "$file" "${file}.js"
  fi
done

# Rename all routes files to .js
cd ../routes
for file in *; do
  if [[ ! "$file" == *.js ]]; then
    mv "$file" "${file}.js"
  fi
done

# Rename all models files to .js
cd ../models
for file in *; do
  if [[ ! "$file" == *.js ]]; then
    mv "$file" "${file}.js"
  fi
done