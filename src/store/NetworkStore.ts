import { proxy } from 'valtio';

export interface NetworkData {
  networkName: string;
  chainId: number;
  networkSymbol: string;
}

interface NetWorkListState {
  networkList: NetworkData[];
}

const state = proxy<NetWorkListState>({
  networkList: [
    {
      networkName: 'polygonMumbai',
      chainId: 80001,
      networkSymbol: 'MATIC',
    },
    {
      networkName: 'arbitrumGoerli',
      chainId: 421613,
      networkSymbol: 'AGOR',
    },
    {
      networkName: 'optimsimGoerli',
      chainId: 420,
      networkSymbol: 'ETH',
    },
  ],
});

const NetworkStore = {
  state,
  addNetwork(value: NetworkData) {
    state.networkList.push(value);
  },
  deleteNetwork(value: NetworkData) {
    state.networkList = state.networkList.filter(
      (network) => network.chainId !== value.chainId
    );
  },
};
export default NetworkStore;
