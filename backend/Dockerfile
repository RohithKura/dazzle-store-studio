# ----------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy source code
COPY . .

# ----------------------------
# Stage 2: Runtime stage
# ----------------------------
FROM node:18-alpine

WORKDIR /app

# Copy only needed files from builder stage
COPY --from=builder /app /app

# Expose backend port (example: 5000)
EXPOSE 5000

# Start backend
CMD ["node", "server.js"]

