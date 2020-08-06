# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app

RUN npm config set unsafe-perm true

RUN npm install react-scripts@3.0.1 -g --silent
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
COPY . /app
RUN npm cache clean --force
RUN export NODE_OPTIONS=--max_old_space_size=4096
ARG REACT_APP_ENV=prod
ENV REACT_APP_ENV=$REACT_APP_ENV
ARG REACT_APP_PRIVATE_KEY=gtijo3ttret34665rgf
ENV REACT_APP_PRIVATE_KEY=$REACT_APP_PRIVATE_KEY
RUN GENERATE_SOURCEMAP=false npm run build --nomaps
# production environment
FROM nginx:1.16.0-alpine
# RUN rm -rf /app/build /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY nginx/toihocweb_net.crt /etc/nginx
COPY nginx/toihocweb_net.key /etc/nginx
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
