From php:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


# Bundle app source
COPY . /usr/src/app

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000"]