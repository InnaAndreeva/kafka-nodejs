import kafka from "kafka-node";

const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
const kafkaClient = new kafka.Client(
	process.env.KAFKA_ZOOKEEPER_CONNECT,
	"producer-client",
	kafkaClientOptions
);
const kafkaProducer = new kafka.HighLevelProducer(kafkaClient);

const kafkaConsumer = new kafka.HighLevelConsumer(
	kafkaClient,
	[{ topic: "card-topic-success" }],
	{
		autoCommit: true,
		fetchMaxWaitMs: 1000,
		fetchMaxBytes: 1024 * 1024,
		encoding: "buffer",
	}
);

kafkaClient.on("error", (error: Error) =>
	console.error("Kafka client error:", error)
);
kafkaProducer.on("error", (error: Error) =>
	console.error("Kafka producer error:", error)
);
kafkaConsumer.on("error", (error: Error) =>
	console.error("Kafka consumer error:", error)
);

export { kafkaProducer, kafkaConsumer };
