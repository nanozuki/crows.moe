FROM golang:1.20-bullseye AS builder
WORKDIR /app
COPY . .
RUN go mod tidy
RUN go build -o mediavote

FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /app/mediavote ./
CMD ["./mediavote"]
