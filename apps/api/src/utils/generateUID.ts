export const generateUID = (length: number) => {
  return window
    .btoa(
      Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2)))
        .map(b => String.fromCharCode(b))
        .join('')
    )
    .replace(/[+/]/g, '')
    .substring(0, length);
};
