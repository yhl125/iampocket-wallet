import { ChainData, ChainsData, TokenData } from '@/data/SquidData';
import { proxyWithLocalStorage } from '@/utils/StoreUtil';
import { proxy } from 'valtio';

export interface State {
  isSquidInit: Boolean;
  chainDataList: ChainsData;
  tokenDataList: TokenData[];
}

const state = proxyWithLocalStorage<State>('SquidState',{
  isSquidInit: false,
  chainDataList: [],
  tokenDataList: [],
});

const SquidStore = {
  state,
  setSquidInit() {
    state.isSquidInit = true;
  },
  setSquidUnInit() {
    state.isSquidInit = false;
  },
  setChainDataList(chainList: ChainsData) {
    state.chainDataList = chainList;
  },
  setTokenDataList(tokenList: TokenData[]) {
    state.tokenDataList = tokenList;
  },
};

export default SquidStore;
