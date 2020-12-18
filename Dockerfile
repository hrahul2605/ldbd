FROM node:lts

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

ENV HOST 0.0.0.0
CMD [ "npm","start" ]