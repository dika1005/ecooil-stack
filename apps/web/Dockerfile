# ========================================
# EcoOil Web - Dockerfile
# ========================================
FROM oven/bun:1 AS base
WORKDIR /app

# ----------------------------------------
# Install dependencies
# ----------------------------------------
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ----------------------------------------
# Build stage
# ----------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV NODE_ENV=production
RUN bun run build

# ----------------------------------------
# Production stage
# ----------------------------------------
FROM base AS production
ENV NODE_ENV=production

# Copy built application
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD bun -e "fetch('http://localhost:3000/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Run the application
CMD ["bun", "run", ".output/server/index.mjs"]
