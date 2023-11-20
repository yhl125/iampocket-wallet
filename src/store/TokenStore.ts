import { proxyWithLocalStorage } from '@/utils/StoreUtil';

export interface IResponseToken {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string;
  nativeToken: boolean;
  type: string;
  balance: string;
  quote?: number;
  prettyQuote?: string;
  quoteRate?: number;
  quoteRate24hAgo?: number;
}

export interface TokenListState {
  tokenList: IResponseToken[];
}

const tokenListState = proxyWithLocalStorage<TokenListState>('TokenListState', {
  tokenList: [],
});

const TokenStore = {
  tokenListState,
  addTokens(responseTokens: IResponseToken[], chainIds: number[]) {
    // remove same chainIds tokens from tokenListState
    tokenListState.tokenList = tokenListState.tokenList.filter(
      (token) => !chainIds.includes(token.chainId),
    );
    // add new tokens to tokenListState
    tokenListState.tokenList = tokenListState.tokenList.concat(responseTokens);
  },
};

export default TokenStore;
