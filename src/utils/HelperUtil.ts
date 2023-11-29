import { EIP155_CHAINS, TEIP155Chain } from '@/data/EIP155Data';
import { bytesToString, isAddress, isHex } from 'viem';

/**
 * Truncates string (in the middle) via given lenght value
 */
export function truncate(value: string, length: number) {
  if (value?.length && value.length <= length) {
    return value;
  }

  const separator = '...';
  const stringLength = length - separator.length;
  const frontLength = Math.ceil(stringLength / 2);
  const backLength = Math.floor(stringLength / 2);

  return (
    value.substring(0, frontLength) +
    separator +
    value.substring(value.length - backLength)
  );
}

export function truncateAddress(address: string) {
  return truncate(address, 14);
}

/**
 * Converts hex to utf8 string if it is valid bytes
 */
export function convertHexToUtf8(value: string) {
  if (isHex(value)) {
    const fromHexStringtoUint8Array = (hexString: string) =>
      Uint8Array.from(
        hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
      );
    return bytesToString(fromHexStringtoUint8Array(value));
  }

  return value;
}

/**
 * Gets message from various signing request methods by filtering out
 * a value that is not an address (thus is a message).
 * If it is a hex string, it gets converted to utf8 string
 */
export function getSignParamsMessage(params: string[]) {
  const message = params.filter((p) => !isAddress(p))[0];
  return convertHexToUtf8(message);
}

/**
 * Gets data from various signTypedData request methods by filtering out
 * a value that is not an address (thus is data).
 * If data is a string convert it to object
 */
export function getSignTypedDataParamsData(params: string[]) {
  const data = params.filter((p) => !isAddress(p))[0];

  if (typeof data === 'string') {
    return JSON.parse(data);
  }

  return data;
}

/**
 * Get our address from params checking if params string contains one
 * of our wallet addresses
 */
export function getWalletAddressFromParams(addresses: string[], params: any) {
  const paramsString = JSON.stringify(params);
  let address = '';

  addresses.forEach((addr) => {
    if (paramsString.toLowerCase().includes(addr.toLowerCase())) {
      address = addr;
    }
  });

  return address;
}

/**
 * Check if chain is part of EIP155 standard
 */
export function isEIP155Chain(chain: string) {
  return chain.includes('eip155');
}

/**
 * Formats chainId to its name
 */
export function formatChainName(chainId: string) {
  return EIP155_CHAINS[chainId as TEIP155Chain]?.name ?? chainId;
}

/**
 * Sets comma on input value
 */
export function setComma(inputValue: number): string {
  let numStr = inputValue.toString();
  numStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return numStr;
}
