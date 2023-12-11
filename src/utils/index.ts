export const convertByteToMb = (input: number) => {
  const megabytes = input / (1024 * 1024);
  const formattedMegabytes = megabytes.toFixed(2);
  return formattedMegabytes;
}
