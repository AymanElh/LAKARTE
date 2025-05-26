FROM php:8.3-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    zip \
    libpq-dev \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libxml2-dev \
    libonig-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libxslt1-dev \
    curl \
    gnupg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install \
        zip \
        pdo \
        pdo_pgsql\
        bcmath \
        mbstring \
        fileinfo \
        ctype \
        intl \
        gd \
        xml

# Install node js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

WORKDIR /var/www/html

RUN a2enmod rewrite


# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

COPY . /var/www/html/

EXPOSE 80
