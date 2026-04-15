# Niamoto Site — Astro 5 static build served by Caddy
# Multi-stage: builder (Node 22) → runtime (Caddy alpine)

# ------- BUILDER -------
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Install deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source and build
COPY . .
RUN pnpm build

# ------- RUNTIME -------
FROM caddy:2-alpine AS runtime

# Serve static build
COPY --from=builder /app/dist /usr/share/caddy

# Custom Caddyfile (cache headers, spa fallback not needed for Astro)
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
# Caddy default CMD runs /etc/caddy/Caddyfile
