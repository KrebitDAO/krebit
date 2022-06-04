FROM node:lts-alpine AS base
ENV SCOPE=node
RUN apk update && apk add git
WORKDIR /app
COPY . /app
RUN yarn global add turbo
RUN yarn global add pm2
RUN yarn install
RUN turbo run build --filter=${SCOPE}
CMD pm2-runtime "yarn node-start"
