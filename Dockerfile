FROM node:16.16.0
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm ci
RUN npm build

CMD npm start