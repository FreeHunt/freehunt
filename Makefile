up:
	docker compose -f compose.yaml -f compose.dev.yaml up -d

down:
	docker compose -f compose.yaml -f compose.dev.yaml down
