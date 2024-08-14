FROM nginx:alpine

RUN apk update && apk upgrade &&  apk add curl openssl --no-cache

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/ss.key \
-out /etc/ssl/certs/ss.crt \
-subj "/C=/ST=/L=/O=1337/OU=/CN=srachdi"

RUN rm /etc/nginx/conf.d/*

# COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 443

CMD [ "nginx", "-g", "daemon off;" ]