FROM node:18-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y python3 make g++

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm 
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install -g pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
RUN npm install -g pnpm

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app .

EXPOSE 3000

ENV PORT 3000

CMD ["pnpm", "run", "start"]

