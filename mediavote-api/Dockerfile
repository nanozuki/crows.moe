FROM golang:1.20-bullseye AS builder
WORKDIR /app
COPY . .
RUN go mod verify
RUN go mod download
RUN go build -o mediavote

FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y ca-certificates
WORKDIR /app
COPY --from=builder /app/mediavote ./
CMD ["./mediavote"]
