import AddressStore from '@/store/AddressStore';
import PKPStore from '@/store/PKPStore';
import { createOrRestoreERC4337Wallet } from '@/utils/ERC4337WalletUtil';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

function useAccounts() {
  const { isAuthenticated, currentPKP, authSig } = useSnapshot(PKPStore.state);
  const { erc4337Address } = useSnapshot(AddressStore.state);

  useEffect(() => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }
    if (!erc4337Address) {
      createOrRestoreERC4337Wallet(currentPKP!.publicKey, authSig!);
    }
  }, [authSig, currentPKP, erc4337Address, isAuthenticated]);
};

export default useAccounts;
