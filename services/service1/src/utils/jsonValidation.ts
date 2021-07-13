export const isValidJSON = (text: string): boolean => {
	if (typeof text !== "string") {
		return false;
	}
	try {
		JSON.parse(text);
		return true;
	} catch (error) {
		return false;
	}
};

export const isRequiredFieldsPresent = (text: string): boolean => {
	const requiredFields = ["cardNumber", "expirationDate", "cv", "cardHolder"];

	try {
		const input = JSON.parse(text);

		return requiredFields.every((field) => input[field]);
	} catch (error) {
		return false;
	}
};

// const jsonObj = JSON.stringify({
// 	cardNumber: "4007000000027",
// 	expirationDate: "02/20",
// 	cv: "123",
// 	cardHolder: "John Smith",
// });

// console.log(isValidJSON(jsonObj));

// console.log(isRequiredFieldsPresent(jsonObj));
