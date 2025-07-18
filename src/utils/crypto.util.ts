import { CRYPT_ALGO } from "@/config/env";
import crypto from "node:crypto";

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

interface Encrypt {
    iv: string;
    encryptedData: string;
}

export const encrypt = (text: string): Encrypt => {
    const cipher = crypto.createCipheriv(CRYPT_ALGO, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

export const decrypt = (text: Encrypt): string => {
    const decipherIv = Buffer.from(text.iv, "hex");
    const encryptedText = Buffer.from(text.encryptedData, "hex");
    const decipher = crypto.createDecipheriv(
        CRYPT_ALGO,
        Buffer.from(key),
        decipherIv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
