import { ChainId, UserTxType } from '@socket.tech/socket-v2-sdk';

export interface BridgeCurrency {
  address: string;
  decimals: number;
  icon?: string;
  minNativeCurrencyForGas?: string;
  name: string;
  symbol: string;
  chainId?: number;
  logoURI: string;
  chainAgnosticId?: string;
}

export declare enum Bridge {
  Hop = "hop",
  AnySwap = "anyswap",
  AnySwapRouterV4 = "anyswap-router-v4",
  AnySwapRouterV6 = "anyswap-router-v6",
  PolygonBridge = "polygon-bridge",
  ArbitrumBridge = "arbitrum-bridge",
  Hyphen = "hyphen",
  Across = "across",
  OptimismBridge = "optimism-bridge",
  Celer = "celer",
  refuel = "refuel-bridge",
  Stargate = "stargate",
  Connext = "connext",
  CCTP = "cctp",
  Synapse = "synapse",
  BaseBridge = "base-bridge",
  ZoraBridge = "zora-bridge",
  ZkSyncNative = "zksync-native"
}

export interface UserTx {
  userTxType: UserTxType;
}

export interface BridgeRoute {
  /**
   * Unique id for each route.
   */
  routeId: string;
  /**
   * Contains only on single swap.
   */
  isOnlySwapRoute: boolean;
  /**
   * Sending token amount.
   */
  fromAmount: string;
  chainGasBalances: any;
  minimumGasBalances: any;
  /**
   * Approximate receiving token amount.
   */
  toAmount: string;
  /**
   * Array of bridges used in the route
   */
  usedBridgeNames: Array<Bridge>;
  /**
   * Total number of transactions for the route.
   */
  totalUserTx: number;
  /**
   * Combined USD gas fees for all transactions in the route.
   */
  totalGasFeesInUsd: number;
  /**
   * Address of user receiving the amount.
   */
  recipient: string;
  /**
   * Address of user making the transactions.
   */
  sender: string;
  /**
   * Array of user transactions.
   */
  userTxs: Array<UserTx>;
  /**
   * Estimate of total time in seconds, excluding the transaction time.
   */
  serviceTime: number;
  /**
   * Estimate of max time to exit from the chain in seconds.
   */
  maxServiceTime: number;
  /**
   * Receive Value
   */
  receivedValueInUsd?: number;
  /**
   * Input Value
   */
  inputValueInUsd: number;
  /**
   * Output Value
   */
  outputValueInUsd: number;
  /**
   * Integrator Fee.
   */
  integratorFee: {
    amount: string;
    asset: BridgeToken;
    feeTakerAddress?: string;
  };
  /**
   * Extra Data, includes OP Rebate details
   */
  extraData?: ExtraData;
}
export type ExtraData = {
  opRebateData?: OpRebateData;
};

export type OpRebateData = {
  amount: string;
  asset: BridgeToken;
  amountInUsd: number;
};

export interface BridgeToken {
  /**
   * Name of token.
   */
  name?: string;
  /**
   * Address of token.
   */
  address: string;
  /**
   * URL for icon of token.
   */
  icon?: string;
  /**
   * Decimal used for token.
   */
  decimals?: number;
  /**
   * Symbol of token.
   */
  symbol: string;
  /**
   * Chain id of the token
   */
  chainId: ChainId;
  /**
   * URL for icon of token.
   */
  logoURI?: string;
  /**
   * Unique Id over all chains
   */
  chainAgnosticId?: string | null;
}

export declare enum BridgeChainId {
  POLYGON_CHAIN_ID = 137,
  MAINNET_CHAIN_ID = 1,
  XDAI_CHAIN_ID = 100,
  ARBITRUM_CHAIN_ID = 42161,
  FANTOM_CHAIN_ID = 250,
  OPTIMISM_CHAIN_ID = 10,
  AVAX_CHAIN_ID = 43114,
  BSC_CHAIN_ID = 56,
  AURORA_CHAIN_ID = 1313161554,
  POLYGON_ZKEVM_CHAIN_ID = 1101,
  ZKSYNC_ERA_CHAIN_ID = 324,
  ZORA_CHAIN_ID = 7777777,
  BASE_CHAIN_ID = 8453,
}

export const defaultSourceNetwork = {
  chainId: 1,
  name: 'Ethereum',
  isL1: true,
  sendingEnabled: true,
  icon: 'https://movricons.s3.ap-south-1.amazonaws.com/Ether.svg',
  receivingEnabled: true,
  refuel: {
    sendingEnabled: true,
    receivingEnabled: false,
  },
  currency: {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    minNativeCurrencyForGas: '15000000000000000',
  },
  rpcs: ['https://rpc.ankr.com/eth'],
  explorers: ['https://etherscan.io'],
};

export const defaultDestNetwork = {
  chainId: 137,
  name: 'Polygon',
  icon: 'https://movricons.s3.ap-south-1.amazonaws.com/Matic.svg',
  isL1: false,
  sendingEnabled: true,
  receivingEnabled: true,
  refuel: {
    sendingEnabled: true,
    receivingEnabled: true,
  },
  currency: {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    minNativeCurrencyForGas: '30000000000000000',
  },
  rpcs: [
    'https://rpc-mainnet.matic.network',
    'wss://ws-mainnet.matic.network',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://matic-mainnet.chainstacklabs.com',
  ],
  explorers: ['https://polygonscan.com'],
};

export const defaultSourceToken = {
  name: 'USDCoin',
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
  decimals: 6,
  symbol: 'USDC',
  chainId: 1,
  logoURI:
    'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
  chainAgnosticId: 'USDC',
};
export const defaultDestToken = {
  name: 'USDCoin',
  address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
  decimals: 6,
  symbol: 'USDC',
  chainId: 137,
  logoURI:
    'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
  chainAgnosticId: 'USDC',
};

export interface Network {
  chainId: number;
  currency: BridgeCurrency;
  explorers: string[];
  icon: string;
  isL1: boolean;
  name: string;
  receivingEnabled: boolean;
  refuel?: {
    sendingEnabled: boolean;
    receivingEnabled: boolean;
  };
  rpcs: string[];
  sendingEnabled: string;
}
