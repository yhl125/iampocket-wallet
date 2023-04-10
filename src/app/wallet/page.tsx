'use client';

import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useState } from 'react';
import { getSimpleAccount } from '../api/src';
import config from '../../../config.json';

const WalletPage = () => {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [loadingState, setLoading] = useState('loaded');

  const createAddress = async () => {
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const accountAPI = getSimpleAccount(
      provider,
      config.signingKey,
      config.entryPoint,
      config.simpleAccountFactory
    );
    const address = await accountAPI.getCounterFactualAddress();
    setAddress(address);
    await getAddressGoerliBalance(address);
    console.log(`SimpleAccount address: ${address}`);
  };

  const getAddressGoerliBalance = async (addressOrEns: string) => {
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const bigNumberBalance = await provider.getBalance(addressOrEns);
    console.log(bigNumberBalance);
    const balance = formatEther(bigNumberBalance);
    setBalance(balance);
  };

  const truncateAddress = (address: string) => {
    console.log(address.length);
    return (
      address.substring(0, 4) +
      '...' +
      address.substring(address.length - 6, address.length)
    );
  };
  return <div></div>;
};

export default WalletPage;
