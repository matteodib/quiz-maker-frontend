FROM node:16

ENV NODE_ENV development

WORKDIR /app
COPY . .

RUN npm install 
RUN npm run build

EXPOSE 3000
EXPOSE 24678