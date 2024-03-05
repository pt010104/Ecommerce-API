FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN yarn install  --production
COPY . .
CMD ["node", "./server.js"]
EXPOSE 5050