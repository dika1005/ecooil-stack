# ========================================
# EcoOil API - Dockerfile
# ========================================
FROM oven/bun:1 AS base
WORKDIR /app

# ----------------------------------------
# Install dependencies
# ----------------------------------------
FROM base AS deps
COPY package.json bun.lock* ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN bun install --frozen-lockfile

# ----------------------------------------
# Build stage
# ----------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN bunx prisma generate --schema=./prisma/schema.prisma

# ----------------------------------------
# Production stage
# ----------------------------------------
FROM base AS production
ENV NODE_ENV=production

# Copy node_modules and generated prisma client
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/generated ./generated
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma.config.ts ./

# Expose port
EXPOSE 5050

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:5050/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Run the application
CMD ["bun", "run", "src/index.ts"]
