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
import FetchTokens from './fetchToken';
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

function Wallet() {
  useWalletWithPKP();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const { zeroDevAddress, pkpViemAddress, selectedWallet } = useSnapshot(
    AddressStore.state,
  );
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

  return (
    mounted && (
      <>
        <FetchTokens
          address={getCurrentAddress(selectedWallet)}
          chainIds={chainIds}
          quoteCurrency={'USD'}
        />
        {/* TODO: add real number */}
        <WalletSummary
          userAddress={getCurrentAddress(selectedWallet)}
          totalBalance={12425}
        />
        <WalletFunctions />
        <WalletTabs
          activeItem={selectedTabIndex}
          setActiveItem={setSelectedTabIndex}
        />
        {selectedTabIndex === 0 && <AssetList chainIds={chainIds} />}
      </>
    )
  );
}

export default Wallet;
