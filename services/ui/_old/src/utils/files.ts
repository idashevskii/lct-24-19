export const arrayBufferToBase64 = (input: ArrayBuffer) => {
  return btoa(new Uint8Array(input).reduce((data, byte) => data + String.fromCharCode(byte), ''));
};
