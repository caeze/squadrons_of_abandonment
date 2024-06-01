FROM node:14

WORKDIR /app

COPY game/ /app/

RUN npm install

RUN npm run build

CMD [ "npm", "start" ]