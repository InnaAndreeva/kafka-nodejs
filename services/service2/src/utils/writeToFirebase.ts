const saltedMd5 = require("salted-md5");
const admin = require("firebase-admin");
const uuidv4 = require("uuid/v4");
require("dotenv").config({ path: "../src/.env" });

const { serviceAccount, storageBucket } = require("./serviceAccountKey");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket,
});

const bucket = admin.storage().bucket();

export async function writeToFirebase(id: string): Promise<string> {
    const metadata = {
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        },
        contentType: "image/png",
        cacheControl: "public, max-age=31536000",
    };

    const fileName: string = "./utils/cardBuf.png";
    const destinationName: string = saltedMd5(id, process.env.SALT);

    await bucket.upload(fileName, {
        gzip: true,
        metadata: metadata,
        destination: `${destinationName}.png`,
    });

    const files: Array<any> = await bucket
        .file(`${destinationName}.png`)
        .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
        });

    return files[0];
}
