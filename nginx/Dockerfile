FROM nginx:1.21.6
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY ./crt/kwai.chinawarthog.com_bundle.crt /etc/nginx/
# COPY ./crt/kwai.chinawarthog.com.key /etc/nginx/

# EXPOSE 443