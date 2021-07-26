FROM node:14-buster as builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:latest
EXPOSE 80
COPY --from=builder /app/public /usr/share/nginx/html
