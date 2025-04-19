# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Only copy production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose port (update if your app uses a different one)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
