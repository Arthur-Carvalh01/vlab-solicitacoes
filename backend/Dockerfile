FROM php:8.4-cli

# Instala as bibliotecas do sistema e a extensão do PostgreSQL para o PHP
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

WORKDIR /app

# Inicia o servidor embutido do Laravel e expõe para o Docker
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]