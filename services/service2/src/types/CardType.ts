import * as avro from "avsc";

const avroSchema = {
	name: "Card",
	type: "record",
	fields: [
		{
			name: "id",
			type: "string",
		},

		{
			name: "cardNumber",
			type: "string",
		},
		{
			name: "expirationDate",
			type: "string",
		},
		{
			name: "cv",
			type: "string",
		},
		{
			name: "cardHolder",
			type: "string",
		},
	],
};

const type = avro.parse((avroSchema as unknown) as string);

export default type;
