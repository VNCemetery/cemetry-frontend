# Stage 1: Build the application
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Copy SSL certificates
COPY ssl/ssl.crt /etc/nginx/ssl/
COPY ssl/ssl.key /etc/nginx/ssl/

# Copy the built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy .env file
COPY .env /usr/share/nginx/html/.env

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Expose both HTTP and HTTPS ports
EXPOSE 80 443

# Start nginx with env variable injection
CMD ["nginx", "-g", "daemon off;"]
