import Jimp from "jimp";

type generateCardParamsType = {
    cardNumber: string;
    expirationDate: string;
    cardHolder: string;
};

export const generateCard = async ({
    cardNumber,
    expirationDate,
    cardHolder,
}: generateCardParamsType): Promise<void> => {
    await Jimp.read("./utils/card.png")
        .then(async (img: any) => {
            const whiteFont = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
            const blackFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

            const formattedCardNumber: string = cardNumber
                .split("")
                .reduce((acc, el, i) => {
                    acc.push(el);
                    if ((i + 1) % 4 === 0 && i !== 0) {
                        acc.push("  ");
                    }
                    return acc;
                }, [])
                .join("");

            await img.print(whiteFont, 50, 145, formattedCardNumber);
            await img.print(blackFont, 70, 400, cardHolder);
            return img.print(blackFont, 550, 400, expirationDate);
        })
        .then((img: any) => {
            img.write("./utils/cardBuf.png");
        });
};
