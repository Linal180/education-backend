
#staging 
FROM node:18-alpine AS build
 
WORKDIR /user/src/app
 
COPY package*.json ./
 
RUN npm install 
 
COPY . . 
 
 RUN npm run build 

#production
FROM node:18-alpine 
 
WORKDIR /user/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
 
COPY --form=build /usr/src/app/dist ./dist

COPY package*.json ./

RUN npm install --only=production 
 
RUN rm package*.json

EXPOSE 3000

CMD['node', 'dist/main.js']
