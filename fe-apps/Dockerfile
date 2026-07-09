# syntax=docker/dockerfile:1
# Build Angular MF apps in fe-apps workspace (host / user-feat / product-feat)
ARG NODE_IMAGE=swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/node:20-alpine
ARG NGINX_IMAGE=swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nginx:1.27-alpine

FROM ${NODE_IMAGE} AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Browser-facing URLs (same-origin via gateway by default)
ARG API_URL=/api
ARG ORDER_REMOTE_ENTRY=/mf/order/remoteEntry.js
ARG PROJECT=host

RUN sed -i "s|API_URL: '/api'|API_URL: '${API_URL}'|g" \
      projects/host/src/environments/environment.ts \
 && sed -i "s|ORDER_REMOTE_ENTRY: '/mf/order/remoteEntry.js'|ORDER_REMOTE_ENTRY: '${ORDER_REMOTE_ENTRY}'|g" \
      projects/host/src/environments/environment.ts \
 && npx ng build "${PROJECT}" --configuration=production --base-href=/

FROM ${NGINX_IMAGE} AS runtime
ARG PROJECT=host
COPY --from=build /app/dist/${PROJECT} /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
