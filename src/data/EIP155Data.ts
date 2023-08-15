/**
 * @desc Refference list of eip155 chains
 * @url https://chainlist.org
 */

/**
 * Types
 */
export type TEIP155Chain = keyof typeof EIP155_CHAINS;

interface IEIP155ChainMap {
  [key: string]: {
    chainId: number;
    name: string;
    logo: string;
    rpc: string;
  };
}

/**
 * Chains
 */
export const EIP155_MAINNET_CHAINS: IEIP155ChainMap = {
  'eip155:1': {
    chainId: 1,
    name: 'Ethereum',
    logo: '/chain-logos/eip155/1.svg',
    rpc: 'https://endpoints.omniatech.io/v1/eth/mainnet/public',
  },
  'eip155:137': {
    chainId: 137,
    name: 'Polygon',
    logo: '/chain-logos/eip155/137.svg',
    rpc: 'https://endpoints.omniatech.io/v1/matic/mainnet/public',
  },
  'eip155:42161': {
    chainId: 42161,
    name: 'Arbitrum One',
    logo: '/chain-logos/eip155/42161.svg',
    rpc: 'https://endpoints.omniatech.io/v1/arbitrum/one/public',
  },
  'eip155:10': {
    chainId: 10,
    name: 'Optimism',
    logo: '/chain-logos/eip155/10.svg',
    rpc: 'https://endpoints.omniatech.io/v1/op/mainnet/public',
  },
  'eip155:43114': {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    logo: '/chain-logos/eip155/43114.svg',
    rpc: 'https://endpoints.omniatech.io/v1/avax/mainnet/public',
  },
};

export const EIP155_TEST_CHAINS: IEIP155ChainMap = {
  'eip155:5': {
    chainId: 5,
    name: 'Ethereum Goerli',
    logo: '/chain-logos/eip155/1.svg',
    rpc: 'https://endpoints.omniatech.io/v1/eth/goerli/public',
  },
  'eip155:80001': {
    chainId: 80001,
    name: 'Polygon Mumbai',
    logo: '/chain-logos/eip155/137.svg',
    rpc: 'https://endpoints.omniatech.io/v1/matic/mumbai/public',
  },
  'eip155:421613': {
    chainId: 421613,
    name: 'Arbitrum Goerli',
    logo: '/chain-logos/eip155/42161.svg',
    rpc: 'https://endpoints.omniatech.io/v1/arbitrum/goerli/public',
  },
  'eip155:420': {
    chainId: 420,
    name: 'Optimism Goerli',
    logo: '/chain-logos/eip155/10.svg',
    rpc: 'https://endpoints.omniatech.io/v1/op/goerli/public',
  },
  'eip155:43113': {
    chainId: 43113,
    name: 'Avalanche Fuji',
    logo: '/chain-logos/eip155/43114.svg',
    rpc: 'https://endpoints.omniatech.io/v1/avax/fuji/public',
  },
};

export const EIP155_CHAINS: IEIP155ChainMap = {
  ...EIP155_MAINNET_CHAINS,
  ...EIP155_TEST_CHAINS,
};

/**
 * Methods
 */
export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
};
