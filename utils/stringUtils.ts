export function stringToBigInt(input: string): bigint {
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(input);
  let bigInt = BigInt(0);
  for (let i = 0; i < byteArray.length; i++) {
    bigInt = (bigInt << BigInt(8)) + BigInt(byteArray[i]);
  }
  return bigInt;
}

export function bigIntToString(bigInt: bigint): string {
  const bytes: number[] = [];
  while (bigInt > 0) {
    bytes.push(Number(bigInt & BigInt(255)));
    bigInt = bigInt >> BigInt(8);
  }
  const byteArray = new Uint8Array(bytes.reverse());
  const decoder = new TextDecoder();
  return decoder.decode(byteArray);
}
