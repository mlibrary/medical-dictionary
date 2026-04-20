FROM nginx:alpine@sha256:645eda1c2477aaa9b879f73909b9222c6f19798dd45be6706268d82a661c6e6d

WORKDIR /app

COPY data.json index.html main.js style.css /usr/share/nginx/html/
COPY /svg /usr/share/nginx/html/svg
COPY /img /usr/share/nginx/html/img
