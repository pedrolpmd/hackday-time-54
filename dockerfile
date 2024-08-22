FROM node:16.20.2-slim as builder

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --silent
COPY . .

EXPOSE 3000

CMD yarn start  