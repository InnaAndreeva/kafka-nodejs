import kafka from "kafka-node";

const kafkaClientOptions = {
	sessionTimeout: 100,
	spinDelay: 100,
	retries: 2,
};
const kafkaClient = new kafka.Client(
	process.env.KAFKA_ZOOKEEPER_CONNECT,
	"consumer-client",
	kafkaClientOptions
);

const topics = [{ topic: "card-topic" }];

const options = {
	autoCommit: true,
	fetchMaxWaitMs: 1000,
	fetchMaxBytes: 1024 * 1024,
	encoding: "buffer",
};

const kafkaConsumer = new kafka.HighLevelConsumer(kafkaClient, topics, options);

const kafkaProducer = new kafka.HighLevelProducer(kafkaClient);

kafkaClient.on("error", (error: Error) =>
	console.error("Kafka client error:", error)
);
kafkaProducer.on("error", (error: Error) =>
	console.error("Kafka producer error:", error)
);
kafkaConsumer.on("error", (error) =>
	console.error("Kafka consumer error:", error)
);

export { kafkaProducer, kafkaConsumer };
