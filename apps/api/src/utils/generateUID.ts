export const generateUID = (length: number) => {
  return Buffer.from(
    Array.from(crypto.getRandomValues(new Uint8Array(length * 2)))
      .map(b => String.fromCharCode(b))
      .join('')
  )
    .toString('base64')
    .replace(/[+/]/g, '')
    .substring(0, length);
};
