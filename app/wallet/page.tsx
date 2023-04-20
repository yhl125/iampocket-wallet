'use client';

import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { getSimpleAccount } from '../api/src';
import config from 'config.json';
import SettingsStore from '@/store/SettingsStore';
import { useSnapshot } from 'valtio';
import Link from 'next/link';
import Image from 'next/image';
import copyClipboardSVG from '../../public/copyToClipboard.svg';
import { useRouter } from 'next/navigation';

const WalletPage = () => {
  const [balance, setBalance] = useState<string>();
  const [network, setNetwork] = useState<string>();
  const [symbol, setSymbol] = useState('GoerliETH');
  const { erc4337Address } = useSnapshot(SettingsStore.state);
  const router = useRouter();

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
    getAddressBalance(address, provider);
    // getNetwork();
    console.log(`SimpleAccount address: ${address}`);
  };

  // const getNetwork = async () => {
  //   const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  //   const network = await provider.getNetwork();
  //   setNetwork(network.name);
  //   console.log(network.name);
  // };

  const getAddressBalance = async (
    address: string,
    provider: ethers.providers.JsonRpcProvider
  ) => {
    const bigNumberBalance = await provider.getBalance(address);
    console.log(bigNumberBalance);
    const balance = formatEther(bigNumberBalance);
    setBalance(balance);
  };
  const truncateAddress = (address: String) => {
    return (
      address.substring(0, 7) +
      '...' +
      address.substring(address.length - 7, address.length)
    );
  };

  useEffect(() => {
    createAddress();
  }, []);

  return (
    <>
      <div className="wallet">
        <div className="wallet-header flex justify-between p-4">
          <div className="wallet-address">
            <div className="stat-value">Address</div>
            <div className="address flex">
              <div className="stat-title">
                {truncateAddress(erc4337Address)}
              </div>
              <div className="dropdown-end dropdown">
                <Image
                  tabIndex={0}
                  src={copyClipboardSVG}
                  alt={'copyToClipboard'}
                  onClick={() => navigator.clipboard.writeText(erc4337Address)}
                ></Image>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box bg-base-100 p-1 shadow"
                >
                  <li>copied to clipboard!</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="dropdown-end dropdown py-2">
            <label
              tabIndex={0}
              className="setting-button btn-ghost btn-square btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box mt-7 mt-7 w-52 bg-base-300 p-2 shadow"
            >
              <li>
                <Link href={'/walletconnect'}>Connect Wallet</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t-2 border-gray-400" />
        <div className="wallet-body">
          <div className="asset-overview flex flex-col items-center justify-center border-b-2 p-2">
            <div className="placeholder avatar">
              <div className="w-12 rounded-full border-2 bg-neutral-focus text-neutral-content">
                <span>{/* asset image */}</span>
              </div>
            </div>
            <div className="balance">
              {balance} {symbol}
            </div>
            <div className="asset-options space-around mt-2 flex w-3/4 items-center justify-around">
              <button className="btn-sm btn">Send</button>
              <button className="btn-sm btn">Deposit</button>
            </div>
          </div>
          <div className="token-list flex flex-col items-center justify-center overflow-auto p-2">
            <div className="add-token mt-7">
              <button
                className="btn-ghost btn"
                onClick={() => router.push('/manageToken')}
              >
                Manage Token List
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletPage;
