# ── Stage 1: Dependencies ────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ── Stage 2: Runtime ─────────────────────────────────────────
FROM node:20-alpine AS runner

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY --chown=appuser:appgroup . .

# Remove example env file from image
RUN rm -f .env.example

USER appuser

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
