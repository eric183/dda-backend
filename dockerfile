FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY src ./src
COPY prisma ./prisma

RUN yarn install
COPY . .

RUN yarn build

EXPOSE 3001
# EXPOSE 49156

CMD ["/bin/sh", "-c", "npx prisma generate && yarn start:prod"]