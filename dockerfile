FROM node:10

# clone integrations
WORKDIR /app/lib/integrations
RUN git clone --branch v4.2.1 https://github.com/segment-integrations/analytics.js-integration-segmentio.git

# setup lib
WORKDIR /app/lib
COPY lib/package.json lib/index.js lib/integrations.js ./
RUN npm install

# setup app
WORKDIR /app
COPY package.json webpack.prod.js ./
RUN npm install

# build
RUN npm run build:prod
