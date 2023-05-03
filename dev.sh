docker-compose up -d db
sleep 15

export DB_CONNECTION=mysql
export DB_HOST=localhost
export DB_PORT=3306
export DB_DATABASE=bas
export DB_USERNAME=root
export DB_PASSWORD=password

sleep 1

yarn knex migrate:latest
yarn knex seed:run
yarn dev
docker-compose down
rm -rf db