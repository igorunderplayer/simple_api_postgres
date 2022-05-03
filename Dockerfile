FROM node:16-alpine

WORKDIR /src

ENV PORT 8080

COPY package.json .

RUN npm install

EXPOSE 8080

COPY . .

CMD ["npm", "start"]