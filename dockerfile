FROM node:10

WORKDIR /app

ENV BROWSER chrome

# dependencies
WORKDIR /app/lib/node_modules
RUN git clone --branch v4.2.1 https://github.com/segment-integrations/analytics.js-integration-segmentio.git
WORKDIR /app
COPY package.json bower.json component.json ./
RUN npm install

WORKDIR /app/lib
COPY lib/package.json .
RUN npm install

WORKDIR /app
ADD lib lib

RUN ls
RUN npm run build

RUN ./node_modules/.bin/duo --stdout --standalone analytics lib/index.js
