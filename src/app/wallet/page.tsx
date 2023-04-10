'use client';

import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { getSimpleAccount } from '../api/src';
import config from '../../../config.json';
import SettingsStore from '@/store/SettingsStore';
import { useSnapshot } from 'valtio';

const WalletPage = () => {
  const [balance, setBalance] = useState<string>();
  const { erc4337Address } = useSnapshot(SettingsStore.state);

  const createAddress = async () => {
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const accountAPI = getSimpleAccount(
      provider,
      config.signingKey,
      config.entryPoint,
      config.simpleAccountFactory
    );
    const address = await accountAPI.getCounterFactualAddress();
    SettingsStore.setERC4337Address(address);
    getAddressBalance(address);
    console.log(`SimpleAccount address: ${address}`);
  };

  const getAddressBalance = async (address: string) => {
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const bigNumberBalance = await provider.getBalance(erc4337Address);
    console.log(bigNumberBalance);
    const balance = formatEther(bigNumberBalance);
    setBalance(balance);
  };

  useEffect(() => {
    createAddress();
  }, []);

  return (
    <>
      <div className="wallet">
        <div>
          <text>Your Address is {erc4337Address}</text>
        </div>
        <div>
          <text>Your balance is {balance}</text>
        </div>
      </div>
    </>
  );
};

export default WalletPage;
