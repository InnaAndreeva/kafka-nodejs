import { QueryResult } from "pg";

import Card from "./types/CardType";
import CardId from "./types/CardIdType";
import CardWithImg from "./types/CardWithImgType";

import { kafkaProducer, kafkaConsumer } from "./kafkaConfig";
import pgClient from "./pgConnection";

(async () => {
    kafkaConsumer.on(
        "message",
        async (message: any): Promise<void> => {
            const messageBuffer: Buffer = new Buffer(message.value, "binary");

            const {
                id,
                cardNumber,
                expirationDate,
                cardImgUrl,
                cv,
                cardHolder,
            } = CardWithImg.fromBuffer(messageBuffer.slice(0));

            const insertResponse: QueryResult = await pgClient.query({
                text:
                    "INSERT INTO cards(id, cardNumber, expirationDate, cardImgUrl, cv, cardHolder) VALUES($1, $2, $3, $4, $5, $6)",
                values: [
                    id,
                    cardNumber,
                    expirationDate,
                    cardImgUrl,
                    cv,
                    cardHolder,
                ],
            });

            const payload = [
                {
                    topic: "card-topic-success",
                    messages: CardId.toBuffer({
                        id,
                    }),
                },
            ];

            kafkaProducer.send(payload, (error: Error) => {
                if (error) {
                    console.error("Sending payload failed:", error);
                }
            });
        }
    );
})();
