FROM nginx:1.21.6
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./crt/server.crt /etc/nginx/
COPY ./crt/server.key /etc/nginx/

EXPOSE 443