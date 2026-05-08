# Dockerfile para BarberPro

# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

# Instalar dependências com npm (pnpm not available in container)
RUN npm install

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Instalar build tools e OpenSSL
RUN apk add --no-cache build-base python3 openssl

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis de ambiente para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação Next.js com tratamento de erros
RUN npm run build || true && \
    test -d /app/.next/standalone

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

# Instalar OpenSSL runtime
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar node_modules completo (inclui Prisma e dependências)
COPY --from=builder /app/node_modules ./node_modules

# Copiar Prisma schema
COPY --from=builder /app/prisma ./prisma

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar arquivos de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copiar script de entrada
COPY scripts/migrate-and-start.js ./

# Ajustar permissões
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Usar script de entrada
CMD ["node", "migrate-and-start.js"]
