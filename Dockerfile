# Build stage
 
FROM node:16-alpine AS build
ENV NODE_OPTIONS --max-old-space-size=2048
WORKDIR /app
COPY package.json package-lock.json ./
 
RUN npm install
COPY . .
 
RUN npm run build
# Production stage
 
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html
 
RUN mkdir -p /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]