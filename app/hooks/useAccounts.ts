import { createOrRestoreERC4337Wallet } from '@/utils/ERC4337WalletUtil';
import { ethers } from 'ethers';
import { useEffect } from 'react';

export default function useAccounts(
  provider: ethers.providers.JsonRpcProvider
) {
  useEffect(() => {
    createOrRestoreERC4337Wallet(provider);
  }, [provider]);
}
