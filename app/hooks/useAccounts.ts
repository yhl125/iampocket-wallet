import { createOrRestoreERC4337Wallet } from '@/utils/ERC4337WalletUtil';
import { useEffect } from 'react';

export default function useAccounts() {
  useEffect(() => {
    createOrRestoreERC4337Wallet();
  }, []);
}
