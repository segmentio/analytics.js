FROM node:10

WORKDIR /app

ENV BROWSER chrome

# dependencies
COPY package.json bower.json component.json ./
RUN npm install

WORKDIR /app/lib
COPY lib/package.json .
RUN npm install

WORKDIR /app
ADD lib lib

RUN ls

RUN ./node_modules/.bin/duo --stdout --standalone analytics lib/index.js
