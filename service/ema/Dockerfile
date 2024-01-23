FROM node:18-slim AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
RUN pnpm prune --prod

FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
