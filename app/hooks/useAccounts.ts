import { createOrRestoreERC4337Wallet } from '@/utils/ERC4337WalletUtil';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import config from 'config.json';
import TokenStore from '@/store/TokenStore';

export default function useAccounts(provider:ethers.providers.JsonRpcProvider) {
  
  useEffect(() => {
    createOrRestoreERC4337Wallet(provider);
  }, []);
}
