FROM node:lts-alpine AS build

WORKDIR /usr/src/app

ENV TZ=Europe/Moscow

LABEL authors="kottofey"

COPY package*.json ./

RUN npm ci --verbose

COPY . .

RUN npm run vite:build

FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8893

CMD [ "nginx", "-g", "daemon off;" ]
