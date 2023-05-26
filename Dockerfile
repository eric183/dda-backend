FROM node:latest

WORKDIR /app

# copy package.json and yarn.lock to the container
# COPY package.json yarn.lock ./
# COPY .env .env
COPY package.json .
COPY yarn.lock .
COPY src ./src
COPY prisma ./prisma


RUN npm install pm2 -g

# install dependencies
RUN yarn install 
# copy the rest of the files to the container
COPY . .

RUN yarn build
# ENV DOTENV_CONFIG_PATH=./.env

# set environment variables
ENV NODE_ENV=production

# expose the port
EXPOSE ${SERVER_PORT}
EXPOSE ${SOCKEAT_PORT}


# CMD ["pm2-runtime", ""]
# start the app in production mode
CMD ["yarn", "start:prod"]

# start the app in development mode with hot reloading
# CMD ["yarn", "dev"]