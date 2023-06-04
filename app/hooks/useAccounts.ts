import PKPStore from '@/store/PKPStore';
import { createOrRestoreERC4337Wallet } from '@/utils/ERC4337WalletUtil';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

export default function useAccounts() {
  const {isAuthenticated, currentPKP, authSig} = useSnapshot(PKPStore.state);
  useEffect(() => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }
    createOrRestoreERC4337Wallet(currentPKP!.publicKey, authSig!);
  }, [authSig, currentPKP, isAuthenticated]);
}
