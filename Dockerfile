FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENTRYPOINT ["npm", "run", "dev", "--", "--port=5173", "--host=0.0.0.0"]