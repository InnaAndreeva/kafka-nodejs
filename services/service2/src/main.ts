import { generateCard } from "./utils/generateCard";
import { writeToFirebase } from "./utils/writeToFirebase";

import Card from "./types/CardType";
import CardWithImg from "./types/CardWithImgType";

import { kafkaProducer, kafkaConsumer } from "./kafkaConfig";

(async () => {
	kafkaConsumer.on(
		"message",
		async (message: any): Promise<void> => {
			const messageBuffer: Buffer = new Buffer(message.value, "binary");
			const card = Card.fromBuffer(messageBuffer.slice(0));

			await generateCard(card);
			const cardImgUrl: string = await writeToFirebase(card.cardNumber);

			const payload = [
				{
					topic: "card-topic-with-img",
					messages: CardWithImg.toBuffer({
						...card,
						cardImgUrl,
					}),
				},
			];

			kafkaProducer.send(payload, () => {});
		}
	);
})();
