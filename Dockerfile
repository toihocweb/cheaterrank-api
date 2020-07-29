# build environment
FROM node:12.2.0-alpine as build
WORKDIR /server

COPY package.json /server/package.json
RUN npm install
COPY . /server
ENV NODE_ENV=PROD

CMD [ "npm", "start" ]
