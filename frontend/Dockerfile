FROM node:lts-alpine AS build

ENV TZ=Europe/Moscow \
    NODE_ENV=production

LABEL authors="kottofey"

COPY package*.json ./

RUN npm ci --verbose

COPY . .

RUN npm run vite:build

FROM nginx:stable-alpine

COPY --from=build /dist /usr/share/nginx/html
COPY --from=build ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8893

CMD [ "nginx", "-g", "daemon off;" ]
