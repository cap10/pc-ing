FROM node:lts 
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

RUN yarn add sharp
COPY . .
EXPOSE 3000
CMD npm run dev