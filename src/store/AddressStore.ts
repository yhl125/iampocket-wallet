import { proxyWithLocalStorage } from '@/utils/StoreUtil';

/**
 * Types
 */
interface State {
  erc4337Address: string;
}

/**
 * State
 */
const state = proxyWithLocalStorage<State>('AddressState',{
  erc4337Address: '',
});

/**
 * Store / Actions
 */
const AddressStore = {
  state,
  setERC4337Address(erc4337Address: string) {
    state.erc4337Address = erc4337Address;
  },
};

export default AddressStore;
