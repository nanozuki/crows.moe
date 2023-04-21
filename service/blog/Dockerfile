FROM node:18-slim 

# Install dependencies
RUN npm install -g pnpm 
WORKDIR /app
RUN apt-get update && apt-get install -y python3 make g++

# Disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Build next server
COPY . .
RUN pnpm run build

EXPOSE 3000

ENV PORT 3000

CMD ["pnpm", "run", "start"]
