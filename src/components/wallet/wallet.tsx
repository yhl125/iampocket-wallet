'use client';

import { useSnapshot } from 'valtio';
import Link from 'next/link';
import Image from 'next/image';
import copyClipboardSVG from 'public/copyToClipboard.svg';
import { useRouter } from 'next/navigation';
import { truncateAddress } from '@/utils/HelperUtil';
import { providerOf } from '@/utils/ProviderUtil';
import { useEffect, useState } from 'react';
import AddressStore from '@/store/AddressStore';
import TokenList from './tokenList';
import FetchTokens from './fetchToken';
import useWalletWithPKP from '@/hooks/useWalletWithPKP';

function Wallet() {
  useWalletWithPKP();

  const { erc4337Address } = useSnapshot(AddressStore.state);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <>
        <div className="wallet">
          <div className="wallet-header relative flex items-center justify-center p-4">
            <div className="wallet-address">
              <p className="text-center text-xl">Address</p>
              <div className="address flex">
                <p className="text-sm text-gray-500">
                  {truncateAddress(erc4337Address)}
                </p>
                <div className="dropdown dropdown-end">
                  <Image
                    tabIndex={0}
                    src={copyClipboardSVG}
                    alt={'copyToClipboard'}
                    onClick={() =>
                      navigator.clipboard.writeText(erc4337Address)
                    }
                  ></Image>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content rounded-box p-1 shadow"
                  >
                    <li>copied to clipboard!</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="dropdown dropdown-end absolute right-0 top-0 py-2">
              <label
                tabIndex={0}
                className="setting-button btn btn-square btn-ghost"
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
                className="menu dropdown-content rounded-box mt-7 w-52 bg-base-300 p-2 shadow"
              >
                <li>
                  <Link href={'/walletconnect'}>Connect Wallet</Link>
                </li>
                <li>
                  <Link href = {'/squid'}>Squid</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-gray-400" />
          <div className="wallet-body">
            <div className="asset-overview flex flex-col items-center justify-center border-b-2 p-2">
              <div className="asset-options space-around mt-2 flex w-3/4 items-center justify-around">
                <button
                  className="btn btn-sm"
                  onClick={() => router.push('/transfer')}
                >
                  Send
                </button>
                <button className="btn btn-sm">Deposit</button>
              </div>
            </div>
            <FetchTokens
              address={erc4337Address}
              chainIds={[5, 80001, 421613, 420]}
              quoteCurrency={'USD'}
            />
            <TokenList />
          </div>
        </div>
      </>
    )
  );
}

export default Wallet;
