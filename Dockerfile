# Gunakan base image Nginx yang sangat ringan
FROM nginx:alpine

# Salin file konfigurasi Nginx kustom Anda
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin semua file website Anda ke direktori web root Nginx
COPY . /usr/share/nginx/html

# Beritahu Docker bahwa container akan berjalan di port 80
EXPOSE 80