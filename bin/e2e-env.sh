# Install dependencies.
composer install --no-dev
yarn install --frozen-lockfile
yarn run dist

export DOCKER_FILE=docker-compose.ci.yml
export ZIP_LOCATION=/artifact/templates-patterns-collection.zip

# Bring stack up.
docker-compose -f $DOCKER_FILE up -d

# Wait for mysql container to be ready.
while docker-compose -f $DOCKER_FILE run  --rm -u root cli wp --allow-root db check ; [ $? -ne 0 ];  do
	  echo "Waiting for db to be ready... "
    sleep 1
done

init_environment(){
	#Setup core
	docker-compose -f $DOCKER_FILE run  --rm -u root cli wp --allow-root core update --version=$WP_VERSION
	docker-compose -f $DOCKER_FILE run  --rm -u root cli wp --allow-root core update-db
	docker-compose -f $DOCKER_FILE exec  --rm -u root wordpress chmod 0777 -R /var/www/html/wp-content/
  docker-compose -f $DOCKER_FILE run  --rm -u root cli wp  --allow-root core install --url=http://localhost:8080 --title=SandboxSite --admin_user=admin --admin_password=admin --admin_email=admin@admin.com

  # Install Neve
docker-compose -f $DOCKER_FILE run  --rm -u root cli wp --allow-root theme install --force --activate neve

echo 'installing tpc plugin'
docker-compose -f $DOCKER_FILE run  --rm -u root cli wp  --allow-root plugin install --force --activate $ZIP_LOCATION

  # Install no login plugin
docker-compose -f $DOCKER_FILE run  --rm -u root cli wp --allow-root plugin install --force --activate https://gist.github.com/selul/2f5f76d423f9d44f7b5a927e17001c28/archive/ffe3a56894c9aed005e69268ad50dfb16b8177fb.zip 
}

mkdir -p /var/www/html/wp-content/uploads
rm -rf /var/www/html/wp-content/plugins/akismet

init_environment

docker-compose -f $DOCKER_FILE run  --rm -u root cli wp --allow-root cache flush
docker-compose -f $DOCKER_FILE run  --rm -u root cli wp --allow-root rewrite structure /%postname%/

