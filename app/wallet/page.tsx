'use client';

import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import config from 'config.json';
import SettingsStore from '@/store/SettingsStore';
import { useSnapshot } from 'valtio';
import Link from 'next/link';
import Image from 'next/image';
import copyClipboardSVG from '../../public/copyToClipboard.svg';
import { useRouter } from 'next/navigation';
import TokenList from './component/tokenList';
import useAccounts from '@/hooks/useAccounts';
import TokenStore, { TokenState } from '@/store/TokenStore';
import { truncateAddress } from '@/utils/HelperUtil';

const WalletPage = () => {
  const [balance, setBalance] = useState<string>('');
  const [symbol, setSymbol] = useState('GoerliETH');
  const { erc4337Address } = useSnapshot(SettingsStore.state);
  const { tokenList } = useSnapshot(TokenStore.tokenListState);
  const mainToken = useSnapshot(TokenStore.mainTokenState);
  const router = useRouter();
  const initialProvider = useMemo(
    () => new ethers.providers.JsonRpcProvider(config.rpcUrl),
    []
  );

  const getAddressBalance = async (
    address: string,
    provider: ethers.providers.JsonRpcProvider
  ) => {
    if (provider != undefined) {
      const bigNumberBalance = await provider.getBalance(address);
      const initialBalance = formatEther(bigNumberBalance);
      setBalance(initialBalance);
      const ethInfo: TokenState = {
        name: 'GoerliEthereum',
        tokenSymbol: 'ETH',
        tokenDecimal: 0,
        balance: initialBalance,
      };
      if (mainToken.name == ethInfo.name) {
        console.log('Main Token already set');
      } else {
        console.log(`Main Token not set, Setting ${ethInfo.name} as Main Token`);
        TokenStore.setMainTokenState(ethInfo);
      }
    } else {
      alert('Provider is ' + provider);
    }
  };

  useAccounts();
  useEffect(() => {
    if (erc4337Address == '') return;
    getAddressBalance(erc4337Address, initialProvider);
  }, [erc4337Address, initialProvider]);

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
              className="dropdown-content menu rounded-box mt-7 w-52 bg-base-300 p-2 shadow"
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
              <button className="btn-sm btn" onClick={()=>router.push('/transfer')}>Send</button>
              <button className="btn-sm btn">Deposit</button>
            </div>
          </div>
          <div className="token-list flex flex-col items-center justify-center overflow-auto p-2">
            <TokenList tokenList={tokenList} ethereumBalance={balance} />
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
