'use client';

import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import AddressStore, { selectedWalletType } from '@/store/AddressStore';
import useWalletWithPKP from '@/hooks/useWalletWithPKP';
import {
  zeroDevMainnetChainIds,
  zeroDevTestnetChainIds,
} from '@/data/EIP155Data';
import WalletSummary from './WalletSummary';
import WalletFunctions from './WalletFunctions';
import WalletTabs from './WalletTabs';
import AssetList from './AssetList';
import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { useQuery } from '@apollo/client';
import { findEvmTokenBalanceQuery } from '@/utils/ApiUtil';
import NftList from './NftList';

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
  const chainIds = useMemo(() => {
    return [...zeroDevMainnetChainIds, ...zeroDevTestnetChainIds];
  }, []);

  const pollInterval = 5 * 1000;

  const { data } = useQuery(findEvmTokenBalanceQuery, {
    variables: {
      address: getCurrentAddress(selectedWallet),
      chainIds: chainIds,
      quoteCurrency: 'USD',
    },
    pollInterval,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      TokenStore.addTokens(
        data.findEvmTokenBalance.tokenList as IResponseToken[],
        chainIds,
      );
      TokenStore.setTotalQuote(data.findEvmTokenBalance.totalQuote);
    }
  }, [chainIds, data]);
  if (!mounted) return <></>;

  return (
    <Container>
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
      {selectedTabIndex === 1 && <NftList chainIds={chainIds} />}
    </Container>
  );
}

const Container = styled.div`
  width: calc(100% - 20px);

  margin: 0 auto;
`;

export default Wallet;
