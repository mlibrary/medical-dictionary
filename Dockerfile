FROM nginx:alpine

WORKDIR /app

COPY data.json index.html main.js style.css /usr/share/nginx/html/
COPY /svg /usr/share/nginx/html/svg
COPY /img /usr/share/nginx/html/img