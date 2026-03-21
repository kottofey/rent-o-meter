FROM node:lts-alpine

WORKDIR /usr/src/app

ENV TZ=Europe/Moscow \
    NODE_ENV=production

LABEL authors="kottofey"

COPY package*.json ./

RUN npm ci --verbose

COPY . .

EXPOSE 8892

CMD [ "./start-express" ]
