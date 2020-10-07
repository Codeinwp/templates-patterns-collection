# Install dependencies.
composer install --no-dev
yarn install --frozen-lockfile
yarn run dist

export DOCKER_FILE=docker-compose.ci.yml

# Bring stack up.
docker-compose -f $DOCKER_FILE up -d

# Wait for mysql container to be ready.
while docker-compose -f $DOCKER_FILE run  --rm -u root cli wp --allow-root db check ; [ $? -ne 0 ];  do
	  echo "Waiting for db to be ready... "
    sleep 1
done

init_environment(){
	#Setup core
	wp --allow-root core update --version=$WP_VERSION
	wp --allow-root core update-db
	chmod 0777 -R /var/www/html/wp-content/
}

wp  --allow-root core install --url=http://localhost:8080 --title=SandboxSite --admin_user=admin --admin_password=admin --admin_email=admin@admin.com
mkdir -p /var/www/html/wp-content/uploads
rm -rf /var/www/html/wp-content/plugins/akismet

init_environment

wp --allow-root cache flush
wp --allow-root rewrite structure /%postname%/

