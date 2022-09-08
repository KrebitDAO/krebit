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

// utility to create an ordered array of the given input (of the form [[key:string, value:string], ...])
const objToSortedArray = (obj: { [k: string]: string }): string[][] => {
  const keys: string[] = Object.keys(obj).sort();
  return keys.reduce((out: string[][], key: string) => {
    out.push([key, obj[key]]);
    return out;
  }, [] as string[][]);
};

const arrayToObject = (arr: string[][]): { [k: string]: string } => {
  return arr.reduce((o, key) => ({ ...o, [key[0]]: key[1] }), {});
};

export const base64 = {
  encodeb64,
  blobToBase64,
  decodeb64,
  objToSortedArray,
  arrayToObject
};
