import { ethers } from 'ethers';
import { proxy } from 'valtio';
import { proxySet } from 'valtio/utils';

export interface TokenState {
  name: string;
  tokenSymbol: string;
  tokenDecimal?: number;
  balance: string;
}

export interface TokenListState {
  tokenList: TokenState[];
}
export interface ProviderState {
  provider?: ethers.providers.JsonRpcProvider;
}

const providerState = proxy<ProviderState>({
  provider: undefined,
});

const tokenListState = proxy<TokenListState>({
  tokenList: [],
});
const TokenStore = {
  providerState,
  tokenListState,
  addTokenInfo(value: TokenState) {
    tokenListState.tokenList.push(value);
  },
  deleteTokenInfo(value: TokenState) {
    tokenListState.tokenList = tokenListState.tokenList.filter(
      (token) => token.name !== value.name
    );
  },
  setProvider(provider: ethers.providers.JsonRpcProvider) {
    providerState.provider = provider;
  },
};

export default TokenStore;
