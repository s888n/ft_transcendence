FROM node:20-alpine

RUN apk update && apk add curl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev" ,"--" ,"-H", "0.0.0.0" ,"-p", "3000"]