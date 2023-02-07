# build stage
FROM node:16-alpine as build-stage
WORKDIR /grid-component-frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /grid-component-frontend/dist /usr/share/nginx/html
COPY ./entrypoint.sh /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]