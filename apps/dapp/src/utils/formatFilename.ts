const cleanFilename = (filename: string) => {
  return filename.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

export const formatFilename = (filename: string) => {
  const date = new Date().toISOString();
  const randomString = Math.random().toString(36).substring(2, 7);
  const newFilename = cleanFilename(`${date}-${randomString}`);
  const fileExtension = filename.split('.').pop();

  return `krebit-${newFilename.substring(0, 60)}.${fileExtension}`;
};
