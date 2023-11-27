import { gql } from '@apollo/client';

// Temporary
export interface IBuyTokenInfo {
  name: string;
  decimals: number;
  symbol: string;
}

interface Source {
  name: string;
  proportion: string;
}

interface Order {
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  fillData: {
    tokenAddressPath: string[];
    router: string;
  };
  source: string;
  sourcePathId: string;
  type: number;
}

export interface IPrice {
  chainId: number;
  price: string;
  value: string;
  buyTokenAddress: `0x${string}`;
  buyAmount: string;
  sellTokenAddress: `0x${string}`;
  sellAmount: string;
  gas: string;
  /**
   * For swaps with "ETH" as sellToken,
   * wrapping "ETH" to "WETH" or unwrapping "WETH" to "ETH" no allowance is needed,
   * a null address of 0x0000000000000000000000000000000000000000 is then returned instead.
   */
  AllownaceTarget: string;
}

export interface IQuote {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  to: `0x${string}`;
  data: `0x${string}`;
  value: string;
  expectedSlippage?: string;
  buyTokenAddress: `0x${string}`;
  buyAmount: string;
  sellTokenAddress: `0x${string}`;
  sellAmount: string;
  sources: Source[];
  orders: Order[];
  AllownaceTarget: string;
}

export const queryPrice = gql`
  query findSwapPrice(
    $chainId: Int!
    $sellToken: String!
    $buyToken: String!
    $sellAmount: String
    $buyAmount: String
    $takerAddress: String
  ) {
    findSwapPrice(
      chainId: $chainId
      sellToken: $sellToken
      buyToken: $buyToken
      sellAmount: $sellAmount
      buyAmount: $buyAmount
      takerAddress: $takerAddress
    ) {
      chainid
      price
      value
      buyTokenAddress
      buyAmount
      sellTokenAddress
      sellAmount
      AllownaceTarget
    }
  }
`;

export const queryQuote = gql`
  query findSwapQuote(
    $chainId: Int!
    $sellToken: String!
    $buyToken: String!
    $sellAmount: String
    $buyAmount: String
    $takerAddress: String
  ) {
    findSwapQuote(
      chainId: $chainId
      sellToken: $sellToken
      buyToken: $buyToken
      sellAmount: $sellAmount
      buyAmount: $buyAmount
      takerAddress: $takerAddress
    ) {
      chainid
      price
      guaranteedPrice
      to
      data
      value
      buyTokenAddress
      buyAmount
      sellTokenAddress
      sellAmount
      AllownaceTarget
    }
  }
`;
