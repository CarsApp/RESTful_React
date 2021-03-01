run:
	go run cmd/main.go

dc-up:
	docker-compose up

dc-down:
	docker-compose down

run-db:
	docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres:alpine

exec-db:
	docker exec -it postgres psql -U postgres

down-db:
	docker rm -f postgres

lint: 
	golangci-lint run