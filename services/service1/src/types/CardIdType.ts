import * as avro from "avsc";

const avroSchema = {
	name: "CardId",
	type: "record",
	fields: [
		{
			name: "id",
			type: "string",
		},
	],
};

const type = avro.parse((avroSchema as unknown) as string);

export default type;
