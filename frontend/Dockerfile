FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better caching
# This layer is cached unless package.json or package-lock.json changes
COPY package*.json ./

# Install dependencies
# This layer is cached if package files haven't changed
RUN npm ci --only=production=false

# Copy configuration files
# These change less frequently than source code
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Copy static assets
COPY public ./public
COPY index.html ./

# Copy source code last
# This layer invalidates cache when source code changes
COPY src ./src

# Build the application
# This only runs when source code or config files change
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

