FROM node:16.16.0
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

CMD npm start