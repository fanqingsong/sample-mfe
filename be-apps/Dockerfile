# syntax=docker/dockerfile:1
# Backend config service (Hono)
ARG NODE_IMAGE=swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/node:20-alpine

FROM ${NODE_IMAGE} AS runtime
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
