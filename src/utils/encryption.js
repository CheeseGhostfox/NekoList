import CryptoJS from 'crypto-js';

export const encryptData = (data, secret) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
};

export const decryptData = (ciphertext, secret) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
};
