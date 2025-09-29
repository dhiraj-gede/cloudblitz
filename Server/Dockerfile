# Multi-stage build for Node.js backend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

RUN apk add --no-cache dumb-init curl

# Install all dependencies (including dev dependencies for building)
RUN npm i

# Copy source code and config files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init
RUN apk add --no-cache curl
# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies and skip scripts (no husky)
RUN npm i --omit=dev --ignore-scripts && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy environment example
COPY --chown=nodejs:nodejs .env.example .env.example

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 5000

# Health check


# Start the application
CMD ["dumb-init", "node", "dist/app.js"]