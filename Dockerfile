# Stage 1: Build stage
FROM node:23.11.0-slim AS builder

WORKDIR /app

# Copying dependency files
COPY package*.json ./
RUN npm ci

# Copy the rest of the files
COPY . .

# Installing the static adapter
RUN npm install --save-dev @sveltejs/adapter-static

ENV NODE_ENV=production

# Application build
RUN npm run build

# Stage 2: Production stage
FROM nginx:1.29.2-alpine

# Copy the built files directly to the nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy of the Nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]