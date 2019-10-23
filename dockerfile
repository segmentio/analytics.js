FROM node:10

WORKDIR /app

ENV BROWSER chrome

# dependencies
COPY package.json bower.json component.json ./
RUN npm install

ADD lib lib

RUN ls

RUN ./node_modules/.bin/duo --stdout --standalone analytics lib/index.js
