#!/bin/bash

# Update server.js
sed -i 's/const express = require(.*/import express from "express";/' server.js
sed -i 's/const cors = require(.*/import cors from "cors";/' server.js
sed -i 's/require(.dotenv.)/import "dotenv\/config";/' server.js
sed -i 's/const cookieParser = require(.*/import cookieParser from "cookie-parser";/' server.js
sed -i 's/const errorHandler = require(.*/import errorHandler from ".\/middleware\/error.js";/' server.js
sed -i 's/require(.\/routes\/products./import productsRouter from ".\/routes\/products.js";/' server.js
sed -i 's/require(.\/routes\/categories./import categoriesRouter from ".\/routes\/categories.js";/' server.js
sed -i 's/require(.\/routes\/cart./import cartRouter from ".\/routes\/cart.js";/' server.js
sed -i 's/require(.\/routes\/orders./import ordersRouter from ".\/routes\/orders.js";/' server.js
sed -i 's/require(.\/routes\/auth./import authRouter from ".\/routes\/auth.js";/' server.js

# Update all .js files to use .js extension in imports
find . -name "*.js" -type f -exec sed -i 's/from "\([^"]*\)"/from "\1.js"/g' {} +

# Add .js extension to module.exports files
find . -name "*.js" -type f -exec sed -i 's/module.exports = /export default /g' {} +

# Update require statements to imports
find . -name "*.js" -type f -exec sed -i 's/const \(.*\) = require(\(.*\))/import \1 from \2/g' {} +

# Rename all files to ensure they have .js extension
find . -name "*.js" -type f -exec sh -c 'mv "$1" "${1%.js}.js"' _ {} \;