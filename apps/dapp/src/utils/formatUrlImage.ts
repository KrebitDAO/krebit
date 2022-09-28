export const formatUrlImage = (value: string | File) => {
  if (!value) return;

  if (value instanceof File) {
    return URL.createObjectURL(value);
  }

  if ((value as string)?.startsWith('http')) {
    return value as string;
  }

  if ((value as string)?.startsWith('ipfs')) {
    const content = (value as string).replace('ipfs://', '').split('/');

    return `https://${content[0]}.ipfs.dweb.link/${content[1]}`;
  }
};
