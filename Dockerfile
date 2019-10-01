ARG image_version
FROM node:8
WORKDIR /app
COPY . /app
RUN npm install
WORKDIR /app/client
RUN npm install
RUN npm run build
ENV PORT=8080
WORKDIR /app
CMD npm start
EXPOSE 8080
