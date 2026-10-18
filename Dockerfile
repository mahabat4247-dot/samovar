# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package definition and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application code and build static assets into dist/
COPY . .
RUN npm run build

# Stage 2: Serve stage with Nginx
FROM nginx:alpine

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose container port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
