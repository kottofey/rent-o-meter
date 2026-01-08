FROM node:lts-alpine

ENV TZ=Europe/Moscow \
    NODE_ENV=production

LABEL authors="kottofey"

COPY package*.json ./

RUN npm ci --verbose

COPY . .

EXPOSE 8891

CMD [ "./start-express" ]
