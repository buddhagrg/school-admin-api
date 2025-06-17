FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env.example ./.env
COPY . .

EXPOSE 5000

CMD [ "node", "./src/server.js"]