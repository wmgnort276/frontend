FROM node:16-alpine as development-stage

ARG VUE_APP_DOMAIN_API
ARG VUE_APP_UPLOAD_FILE_API

ENV VUE_APP_DOMAIN_API=$VUE_APP_DOMAIN_API
ENV VUE_APP_UPLOAD_FILE_API=$VUE_APP_UPLOAD_FILE_API

WORKDIR /app

COPY frontend/. ./

RUN npm install

FROM development-stage as build-stage

RUN npm run build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY frontend/.docker/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
