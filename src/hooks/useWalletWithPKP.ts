import AddressStore from '@/store/AddressStore';
import PKPStore from '@/store/PKPStore';
import { createOrRestoreERC4337Wallet } from '@/utils/ERC4337WalletUtil';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

function useWalletWithPKP() {
  const { erc4337Address } = useSnapshot(AddressStore.state);
  const { isAuthenticated, currentPKP, sessionSigs, sessionExpiration } =
    useSnapshot(PKPStore.state);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
    if (sessionExpiration && sessionExpiration < new Date()) {
      PKPStore.setUnauthenticated();
      router.replace('/login');
    }
    if (!erc4337Address && currentPKP && sessionSigs) {
      createOrRestoreERC4337Wallet(currentPKP.publicKey, sessionSigs);
    }
  }, [
    isAuthenticated,
    erc4337Address,
    currentPKP,
    sessionSigs,
    sessionExpiration,
    router,
  ]);
}

export default useWalletWithPKP;
