FROM nginx:stable-alpine

# Копируем статические файлы напрямую (нет процесса сборки)
COPY . /usr/share/nginx/html

# Используем наш конфиг nginx вместо дефолтного
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]