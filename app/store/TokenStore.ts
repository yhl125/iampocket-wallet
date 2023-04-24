import { proxy } from 'valtio';

export interface TokenState {
  name: string;
  tokenSymbol: string;
  tokenDecimal: number;
  balance: string;
}

export interface TokenListState {
  tokenList: TokenState[];
}

const tokenListState = proxy<TokenListState>({
  tokenList: [],
});
const TokenStore = {
  tokenListState,
  addTokenInfo(value: TokenState) {
    tokenListState.tokenList.push(value);
  },
  deleteTokenInfo(value: TokenState) {
    tokenListState.tokenList = tokenListState.tokenList.filter(
      (token) => token.name !== value.name
    );
  },
};

export default TokenStore;
