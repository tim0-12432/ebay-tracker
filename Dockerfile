FROM node:14-alpine
LABEL org.opencontainers.image.description "First version of ebay-tracker-image!"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "start"]