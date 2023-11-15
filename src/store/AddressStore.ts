import { proxyWithLocalStorage } from '@/utils/StoreUtil';

export type selectedWalletType = 'zeroDev' | 'pkpViem';
/**
 * Types
 */
export interface WalletState {
  zeroDevAddress: string;
  pkpViemAddress: string;
  selectedWallet: selectedWalletType;
}

/**
 * State
 */
const state = proxyWithLocalStorage<WalletState>('AddressState', {
  zeroDevAddress: '',
  pkpViemAddress: '',
  selectedWallet: 'zeroDev',
});

/**
 * Store / Actions
 */
const AddressStore = {
  state,
  setZeroDevAddress(zerodevAddress: string) {
    state.zeroDevAddress = zerodevAddress;
  },
  setPkpViemAddress(pkpViemAddress: string) {
    state.pkpViemAddress = pkpViemAddress;
  },
  setSelectedWallet(selectedWallet: selectedWalletType) {
    state.selectedWallet = selectedWallet;
  },
};

export default AddressStore;
