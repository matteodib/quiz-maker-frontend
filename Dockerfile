FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/build build/
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]