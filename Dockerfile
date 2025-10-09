# Stage 1: Build stage
FROM node:23.11.0-slim AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm ci

# Copie du reste des fichiers
COPY . .

# Installation de l'adaptateur static
RUN npm install --save-dev @sveltejs/adapter-static

ENV NODE_ENV=production

# Build de l'application
RUN npm run build

# Stage 2: Production stage
FROM nginx:1.29.2-alpine

# Copie des fichiers buildés directement dans le répertoire html de nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copie de la configuration nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]