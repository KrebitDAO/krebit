FROM node:lts-alpine AS builder
RUN apk update

# Set working directory
WORKDIR /app
RUN yarn global add turbo@1.4.7
COPY . .
RUN turbo prune --scope=@krebitdao/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:lts-alpine AS installer
RUN apk update
RUN apk add git
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
COPY turbo.json turbo.json

RUN yarn install
RUN yarn build-api

FROM node:lts-alpine AS runner
WORKDIR /app
RUN apk add dumb-init

# Set environment variables
ARG SERVER_PORT
ARG SERVER_EXPIRES_YEARS
ARG SERVER_TRUST
ARG SERVER_STAKE
ARG SERVER_PRICE
ARG SERVER_CERAMIC_URL
ARG SERVER_ETHEREUM_SEED
ARG SERVER_NETWORK
ENV SERVER_PORT=${SERVER_PORT}
ENV SERVER_EXPIRES_YEARS=${SERVER_EXPIRES_YEARS}
ENV SERVER_TRUST=${SERVER_TRUST}
ENV SERVER_STAKE=${SERVER_STAKE}
ENV SERVER_PRICE=${SERVER_PRICE}
ENV SERVER_CERAMIC_URL=${SERVER_CERAMIC_URL}
ENV SERVER_ETHEREUM_SEED=${SERVER_ETHEREUM_SEED}
ENV SERVER_NETWORK=${SERVER_NETWORK}
ENV NODE_ENV production

# Don't run production as root
RUN addgroup --system --gid 1001 krebit
RUN adduser --system --uid 1001 krebit
USER krebit
COPY --from=installer /app .

EXPOSE ${SERVER_PORT}
CMD dumb-init node --experimental-specifier-resolution=node apps/api/dist/index.js
