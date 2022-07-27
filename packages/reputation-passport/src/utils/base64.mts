const encodeb64 = (uintarray: ArrayBuffer | SharedArrayBuffer) => {
  const b64 = Buffer.from(uintarray).toString('base64');
  return b64;
};

const blobToBase64 = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const b64 = Buffer.from(arrayBuffer).toString('base64');
  return b64;
};

const decodeb64 = (b64String: string) => {
  return new Uint8Array(Buffer.from(b64String, 'base64'));
};

export const base64 = {
  encodeb64,
  blobToBase64,
  decodeb64,
};
