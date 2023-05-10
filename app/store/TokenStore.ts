import { proxy } from 'valtio';

export interface TokenState {
  name: string;
  tokenSymbol: string;
  tokenDecimal: number;
  balance: string;
  tokenAddress: string;
}

export interface TokenListState {
  tokenList: TokenState[];
}

const tokenListState = proxy<TokenListState>({
  tokenList: [],
});

const mainTokenState = proxy<TokenState>({
  name: '',
  tokenDecimal: 0,
  tokenSymbol: '',
  balance: '',
  tokenAddress: '',
});

const TokenStore = {
  tokenListState,
  mainTokenState,
  setMainTokenState(value: TokenState) {
    mainTokenState.name = value.name;
    mainTokenState.balance = value.balance;
    mainTokenState.tokenDecimal = value.tokenDecimal;
    mainTokenState.tokenSymbol = value.tokenSymbol;
    mainTokenState.tokenAddress = value.tokenAddress;
  },
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
