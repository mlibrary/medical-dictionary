FROM nginx:alpine
COPY . /usr/share/nginx/html



# Copy dockerfile and .md into another location (not application)
# not useful for workflow if you want to see quick changes.
# You'll want a volume for this. Not handled by docker.
# docker-compose.yml for this.
# volumes:
#  - .:/usr/share/nginx/html
#docker-compose-up to see changes.