import CryptoJS from "crypto-js";

const SECRET_KEY = "BitLogicPerfumeSecretKey@256";

// SAME key derivation
const KEY = CryptoJS.SHA256(SECRET_KEY);

// SAME static IV (16 bytes zero)
const IV = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

export function decryptResponse(encryptedPayload) {
  const decrypted = CryptoJS.AES.decrypt(
    encryptedPayload,
    KEY,
    {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  const text = decrypted.toString(CryptoJS.enc.Utf8);

  if (!text) throw new Error("Decryption failed");

  return JSON.parse(text);
}
