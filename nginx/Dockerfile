FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY conf.d/default.conf /etc/nginx/conf.d/

# Copy Swagger UI files
COPY swagger-ui /usr/share/nginx/swagger-ui/

# Expose port 80
EXPOSE 80 