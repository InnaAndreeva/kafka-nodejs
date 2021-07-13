import uuidv4 from "uuid/v4";
import express, {
    Application,
    Router,
    Request,
    Response,
    NextFunction,
} from "express";
import kafka, { ProduceRequest } from "kafka-node";
import { QueryResult } from "pg";

import pgClient from "./pgConnection";
import { kafkaProducer, kafkaConsumer } from "./kafkaConfig";

import Card from "./types/CardType";
import CardIdType from "./types/CardIdType";

import { isValidJSON, isRequiredFieldsPresent } from "./utils/jsonValidation";

const app: Application = express();
const router = Router();

app.use("/service1/api", router);
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
    "/card",
    (req: Request, res: Response): Response => {
        const inputJSON: string = JSON.stringify(req.body);

        if (!isValidJSON(inputJSON))
            return res
                .status(400)
                .json({ message: "Please, provide valid credentials." });
        if (!isRequiredFieldsPresent(inputJSON))
            return res
                .status(400)
                .json({ message: "Please, provide all required data." });

        const { cardNumber, expirationDate, cv, cardHolder } = req.body;

        const messageBuffer = Card.toBuffer({
            id: uuidv4(),
            cardNumber,
            expirationDate,
            cv,
            cardHolder,
        });

        const payload = [
            {
                topic: "card-topic",
                messages: messageBuffer,
                attributes: 1,
            },
        ];

        kafkaProducer.send(
            payload,
            (error: Error, result: ProduceRequest): void => {
                if (error) {
                    console.error("Sending payload failed:", error);
                    // return res.status(500).json(error);
                }
            }
        );

        kafkaConsumer.on(
            "message",
            async (message): Promise<Response> => {
                const messageBuffer: Buffer = new Buffer(
                    message.value,
                    "binary"
                );
                const { id } = CardIdType.fromBuffer(messageBuffer.slice(0));

                const result: QueryResult = await pgClient.query({
                    text: "SELECT cardImgUrl FROM cards WHERE id = $1",
                    values: [id],
                });

                const image: string = result.rows[0].cardimgurl;

                return res.status(202).json({ image });
            }
        );
    }
);

app.listen(process.env.PRODUCER_PORT);
