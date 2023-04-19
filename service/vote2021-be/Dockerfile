FROM golang:1.18-bullseye AS builder
WORKDIR /app
COPY . .
RUN go mod tidy
RUN go build -o vote2021

FROM debian:bullseye
WORKDIR /app
COPY --from=builder /app/vote2021 ./
CMD ["./vote2021"]
