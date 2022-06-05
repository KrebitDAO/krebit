FROM node:lts-alpine AS base
ARG SCOPE
ENV SCOPE=${SCOPE}
RUN apk update && apk add git
WORKDIR /app
COPY . /app
RUN mkdir -p logs
RUN yarn global add turbo
RUN yarn global add pm2
RUN yarn install
RUN turbo run build --filter=${SCOPE}
CMD pm2-runtime "yarn node-start" --error ./logs/error.log --output ./logs/output.log --no-auto-exit
