'use client';

import { useSnapshot } from 'valtio';
import Link from 'next/link';
import Image from 'next/image';
import copyClipboardSVG from 'public/copyToClipboard.svg';
import { useRouter } from 'next/navigation';
import { truncateAddress } from '@/utils/HelperUtil';
import { useEffect, useState } from 'react';
import AddressStore, { selectedWalletType } from '@/store/AddressStore';
import TokenList from './tokenList';
import { FetchToken, FetchTokens, query } from './fetchToken';
import useWalletWithPKP from '@/hooks/useWalletWithPKP';
import {
  zeroDevMainnetChainIds,
  zeroDevTestnetChainIds,
} from '@/data/EIP155Data';
import SelectWallet from './selectWallet';
import WalletSummary from './WalletSummary';
import WalletFunctions from './WalletFunctions';
import WalletTabs from './WalletTabs';
import AssetList from './AssetList';
import TokenStore from '@/store/TokenStore';
import { useQuery } from '@apollo/client';

function Wallet() {
  useWalletWithPKP();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const { zeroDevAddress, pkpViemAddress, selectedWallet } = useSnapshot(
    AddressStore.state,
  );
  const { totalQuote } = useSnapshot(TokenStore.tokenListState);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  function getCurrentAddress(selectedWallet: selectedWalletType) {
    if (selectedWallet === 'zeroDev') return zeroDevAddress;
    else if (selectedWallet === 'pkpViem') return pkpViemAddress;
    else return zeroDevAddress;
  }
  const chainIds = [...zeroDevMainnetChainIds, ...zeroDevTestnetChainIds];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <>
      {/* <FetchTokens
        address={getCurrentAddress(selectedWallet)}
        chainIds={chainIds}
        quoteCurrency={'USD'}
      /> */}
      <WalletSummary
        userAddress={getCurrentAddress(selectedWallet)}
        totalBalance={totalQuote}
      />
      <WalletFunctions />
      <WalletTabs
        activeItem={selectedTabIndex}
        setActiveItem={setSelectedTabIndex}
      />
      {selectedTabIndex === 0 && <AssetList chainIds={chainIds} />}
      <FetchTokens
        address={getCurrentAddress(selectedWallet)}
        chainIds={chainIds}
        quoteCurrency={'USD'}
      />
    </>
  );
}

export default Wallet;
