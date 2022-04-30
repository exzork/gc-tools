FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --production
COPY . .
RUN yarn build
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=builder /app/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx","-g","daemon off;"]