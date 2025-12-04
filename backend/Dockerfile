# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --only=production=false && \
    npm cache clean --force

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY src ./src

# Build TypeScript to JavaScript
RUN npm run build

# Verify build output exists
RUN ls -la /app/dist/ || (echo "Build failed - dist folder not found" && exit 1)

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy built files from build stage (as root)
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist

# Copy .env.example for validation (not .env for security)
COPY --chown=nodejs:nodejs .env.example ./.env.example

# Verify dist folder was copied
RUN ls -la /app/dist/ || (echo "Copy failed - dist folder not found" && exit 1)

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use node directly for better signal handling
CMD ["node", "dist/index.js"]

