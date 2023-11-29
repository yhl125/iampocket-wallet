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
  totalQuote: number;
}

const tokenListState = proxyWithLocalStorage<TokenListState>('TokenListState', {
  tokenList: [],
  totalQuote: 0,
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
  setTotalQuote(totalQuote: number) {
    tokenListState.totalQuote = totalQuote;
  },
};

export default TokenStore;
