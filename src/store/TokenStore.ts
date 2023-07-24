import { proxyWithLocalStorage } from '@/utils/StoreUtil';

export interface ResponseToken {
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

export interface TokenState extends ResponseToken {
  chainId: number;
}

export interface TokenListState {
  tokenList: TokenState[];
}

const tokenListState = proxyWithLocalStorage<TokenListState>('TokenListState', {
  tokenList: [],
});

const TokenStore = {
  tokenListState,
  addTokens(responseTokens: ResponseToken[], chainId: number) {
    const newTokens = responseTokens.map((token) => {
      return {
        ...token,
        chainId: chainId,
      };
    });
    // remove same chainId tokens from tokenListState
    tokenListState.tokenList = tokenListState.tokenList.filter(
      (token) => token.chainId !== chainId
    );
    // add new tokens to tokenListState
    tokenListState.tokenList = tokenListState.tokenList.concat(newTokens);
  },
};

export default TokenStore;
