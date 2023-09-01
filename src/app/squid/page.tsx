'use client';

import { useState } from 'react';
import Header from '@/components/squid/Header';
import FromBox from '@/components/squid/FromBox';
import ToBox from '@/components/squid/ToBox';
import { ChainData } from '@/data/SquidData';
import useSquid from '@/hooks/useSquid';
import { useIsMounted } from '@/hooks/useIsMounted';
import { ChainView } from '@/components/squid/ChainView';
import SquidStore from '@/store/SquidStore';
import { useSnapshot } from 'valtio';
import TokenView from '@/components/squid/TokenView';
import { SquidTransactionParams, squidTransaction } from '@/utils/squidUtil';
import PKPStore from '@/store/PKPStore';
/**
 * Types
 */
export type AuthView =
  | 'default'
  | 'chainFrom'
  | 'tokenFrom'
  | 'chainTo'
  | 'tokenTo';

const initialFromChainData: ChainData = {
  chainName: 'optimism',
  chainType: 'evm',
  rpc: 'https://goerli.optimism.io',
  networkName: 'Optimism Goerli',
  chainId: 420,
  nativeCurrency: {
    name: 'Optimism',
    symbol: 'ETH',
    decimals: 18,
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png',
  },
  chainIconURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png',
  blockExplorerUrls: ['https://goerli-optimism.etherscan.io/'],
  axelarContracts: {
    gateway: '0xe432150cce91c13a887f7D836923d5597adD8E31',
    forecallable: '0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6',
  },
  squidContracts: {
    squidRouter: '0x481A2AAE41cd34832dDCF5A79404538bb2c02bC8',
    defaultCrosschainToken: '0x254d06f33bDc5b8ee05b2ea472107E300226659A',
    squidMulticall: '0xd9b7849d3a49e287c8E448cea0aAe852861C4545',
  },
  estimatedRouteDuration: 1800,
  estimatedExpressRouteDuration: 20,
  chainNativeContracts: {
    wrappedNativeToken: '0x4200000000000000000000000000000000000006',
    ensRegistry: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    usdcToken: '0xc5D8d1002A9674E41942e3eaeaC41afD74fD557a',
  },
};

const initialToChainData: ChainData = {
  chainName: 'arbitrum',
  chainType: 'evm',
  rpc: 'https://goerli-rollup.arbitrum.io/rpc',
  networkName: 'Arbitrum Goerli',
  chainId: 421613,
  nativeCurrency: {
    name: 'Arbitrum',
    symbol: 'ETH',
    decimals: 18,
    icon: 'https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/arbitrum.svg',
  },
  chainIconURI:
    'https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/arbitrum.svg',
  blockExplorerUrls: ['https://goerli.arbiscan.io/'],
  axelarContracts: {
    gateway: '0xe432150cce91c13a887f7D836923d5597adD8E31',
    forecallable: '0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6',
  },
  squidContracts: {
    squidRouter: '0x481A2AAE41cd34832dDCF5A79404538bb2c02bC8',
    defaultCrosschainToken: '0x254d06f33bDc5b8ee05b2ea472107E300226659A',
    squidMulticall: '0xd9b7849d3a49e287c8E448cea0aAe852861C4545',
  },
  estimatedRouteDuration: 1800,
  estimatedExpressRouteDuration: 20,
  chainNativeContracts: {
    wrappedNativeToken: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
    ensRegistry: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    usdcToken: '',
  },
};

export default function SquidPage() {
  const { tokenDataList, chainDataList } = useSnapshot(SquidStore.state);
  const [view, setView] = useState<AuthView>('default');
  const [selectedFromChain, setSelectedFromChain] =
    useState(initialFromChainData);
  const [selectedFromToken, setSelectedFromToken] = useState(tokenDataList[0]);
  const [selectedToChain, setSelectedToChain] = useState(initialToChainData);
  const [selectedToToken, setSelectedToToken] = useState(tokenDataList[0]);
  const [sendAmount, setSendAmount] = useState<string>('0');
  const { sessionSigs, currentPKP } = useSnapshot(PKPStore.state);

  const isMounted = useIsMounted();
  const squid = useSquid();

  async function handleSubmit() {
    const squiTransactionParams: SquidTransactionParams = {
      selectedFromChain: selectedFromChain,
      selectedToChain: selectedToChain,
      selectedFromToken: selectedFromToken,
      selectedToToken: selectedToToken,
      sendAmount: sendAmount,
      pkpPubKey: currentPKP!.publicKey,
      sessionSigs: sessionSigs!,
      withPM: false,
      squid: squid,
    };
    squidTransaction(squiTransactionParams);
  }

  return (
    isMounted && (
      <div>
        {view === 'default' && (
          <div className="container px-5">
            <Header></Header>
            <div className="from-box mb-2">
              <FromBox
                selectedChain={selectedFromChain}
                setView={setView}
                selectedToken={selectedFromToken}
                setSendAmount={setSendAmount}
              ></FromBox>
              <ToBox
                setView={setView}
                selectedToChain={selectedToChain}
                selectedToToken={selectedToToken}
              ></ToBox>
              <div className="option-section mt-4 flex items-center justify-between">
                <div className="estimated-fee text-xs">
                  <div>0</div>
                  <div>Estimated fee</div>
                </div>
              </div>
              <button
                className="btn mt-8 w-full"
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
            </div>
          </div>
        )}
        {view === 'chainFrom' && (
          <ChainView
            setView={setView}
            setSelectedChain={setSelectedFromChain}
            selectedChain={selectedFromChain}
          ></ChainView>
        )}
        {view === 'tokenFrom' && (
          <TokenView
            setView={setView}
            selectedChain={selectedFromChain}
            setSelectedToken={setSelectedFromToken}
            selectedToken={selectedFromToken}
          ></TokenView>
        )}
        {view === 'chainTo' && (
          <ChainView
            setView={setView}
            setSelectedChain={setSelectedToChain}
            selectedChain={selectedToChain}
          ></ChainView>
        )}
        {view === 'tokenTo' && (
          <TokenView
            setView={setView}
            selectedChain={selectedToChain}
            setSelectedToken={setSelectedToToken}
            selectedToken={selectedToToken}
          ></TokenView>
        )}
      </div>
    )
  );
}
