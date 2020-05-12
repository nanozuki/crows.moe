FROM node:latest

WORKDIR /usr/app

COPY package.json /usr/app
COPY pnpm-lock.yaml /usr/app

RUN npm -g install pnpm
RUN pnpm install

COPY . /usr/app
RUN pnpm run build
CMD ["pnpm","run","start:prod"]
