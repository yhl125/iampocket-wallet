export type TokenData = {
  chainId: number | string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  crosschain?: boolean;
  commonKey?: string;
  logoURI: string;
  coingeckoId: string;
};

export enum ChainName {
  ETHEREUM = 'Ethereum',
  OSMOSIS = 'osmosis',
  OSMOSIS4 = 'osmosis-4',
  MOONBEAM = 'Moonbeam',
  AVALANCHE = 'Avalanche',
  COSMOS = 'cosmoshub',
  AXELARNET = 'Axelarnet',
  KUJIRA = 'kujira',
  SEI = 'sei',
  FETCH = 'fetch',
  CRESCENT = 'crescent',
  EMONEY = 'e-money',
  INJECTIVE = 'injective',
  JUNO = 'juno',
  SECRET = 'secret',
  TERRA2 = 'terra-2',
  POLYGON = 'Polygon',
}

export enum ChainType {
  EVM = 'evm',
  Cosmos = 'cosmos',
}

export type BaseChain = {
  chainId: number | string;
  chainType: ChainType | string;
  chainName: ChainName | string;
  networkName: string;
  rpc: string;
  internalRpc?: string;
  chainIconURI: string;
  blockExplorerUrls: string[];
  estimatedRouteDuration: number;
  estimatedExpressRouteDuration: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
  };
  squidContracts: {
    defaultCrosschainToken: string;
    squidRouter?: string;
    squidMulticall?: string;
  };
  axelarContracts: {
    gateway: string;
    forecallable?: string;
  };
};

export type EvmChain = BaseChain & {
  chainNativeContracts: {
    wrappedNativeToken: string;
    ensRegistry: string;
    multicall: string;
    usdcToken: string;
  };
};

export type CosmosCurrency = {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coingeckoId?: string;
};
export type BIP44 = {
  coinType: number;
};
export type Bech32Config = {
  bech32PrefixAccAddr: string;
  bech32PrefixAccPub: string;
  bech32PrefixValAddr: string;
  bech32PrefixValPub: string;
  bech32PrefixConsAddr: string;
  bech32PrefixConsPub: string;
};
export type CosmosGasType = {
  low: number;
  average: number;
  high: number;
};

export type CosmosChain = BaseChain & {
  rest: string;
  stakeCurrency: CosmosCurrency;
  walletUrl?: string;
  walletUrlForStaking?: string;
  bip44: BIP44;
  alternativeBIP44s?: BIP44[];
  bech32Config: Bech32Config;
  currencies: CosmosCurrency[];
  feeCurrencies: CosmosCurrency[];
  coinType?: number;
  features?: string[];
  gasPriceStep?: CosmosGasType;
  chainToAxelarChannelId: string;
};

export type ChainData = EvmChain | CosmosChain;

export type ChainsData = ChainData[];
