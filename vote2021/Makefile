dockerbuild:
	docker build -f ./Dockerfile.web -t ghcr.io/nanozuki/vote2021-web:1.0.0 .
	docker push ghcr.io/nanozuki/vote2021-web:1.0.0
	docker build -f ./Dockerfile.api -t ghcr.io/nanozuki/vote2021-api:1.0.0 .
	docker push ghcr.io/nanozuki/vote2021-api:1.0.0
