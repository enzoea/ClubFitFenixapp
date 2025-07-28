# Build e sobe tudo com docker-compose
up:
	docker-compose up --build

# Sobe containers sem build
start:
	docker-compose up

# Para containers
down:
	docker-compose down

# Entra no container backend
shell-backend:
	docker exec -it clubfit_backend sh

# Entra no container banco
shell-db:
	docker exec -it postgres_clubfit psql -U postgres -d clubfitdb
