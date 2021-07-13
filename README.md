# Kafka NodeJS Test

## Instructions

This demonstration assumes you already have `docker` and `docker-compose` installed. The steps are as follows:

1. Using `docker-compose`, spin up all containers (Zookeeper, Kafka, Database and services):

```shell
docker-compose up
```

2. Post a request to the cards endpoint:

```shell
curl -X POST http://service1/api/card -H 'Content-Type: application/json' -d
'{ "cardNumber": "4007000000027", "expirationDate": "02/20", "cv": "123", "cardHolder": "John Smith" }'
```

3. As a result program should return JSON containing a card image URL.

```json
{
	"url": "https://storage.googleapis.com/node-kafka.appspot.com/your_card"
}
```
