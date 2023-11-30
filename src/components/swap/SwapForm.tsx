'use client';

import { useState } from 'react';
import { useSnapshot } from 'valtio';
import styled from 'styled-components';

import AddressStore from '@/store/AddressStore';
import PKPStore from '@/store/PKPStore';
import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { IBuyTokenInfo, IPrice, IQuote } from '@/utils/SwapUtil';
import SwapQuoteView from './SwapQuoteView';
import SwapPriceView from './SwapPriceView';
import { useIsMounted } from '@/hooks/useIsMounted';

function SwapForm() {
  const psudoToken: IResponseToken = {
    address: '',
    name: 'Token',
    symbol: 'Token',
    decimals: 18,
    logoUrl: '',
    nativeToken: false,
    type: '',
    balance: '0',
    quote: 0,
    prettyQuote: '0',
    quoteRate: 0,
    quoteRate24hAgo: 0,
    chainId: 80001,
  };

  const walletState = useSnapshot(AddressStore.state);
  const pkpState = useSnapshot(PKPStore.state);
  const { tokenList } = useSnapshot(TokenStore.tokenListState);
  const [chainId, setChainId] = useState(80001);

  const [finalize, setFinalize] = useState(false);

  const [price, setPrice] = useState<IPrice | undefined>();
  const [quote, setQuote] = useState<IQuote | undefined>();

  const [sellToken, setSellToken] = useState<IResponseToken | undefined>(() =>
    tokenList.length == 0 ? psudoToken : tokenList[0],
  );
  const [buyToken, setBuyToken] = useState<IBuyTokenInfo | undefined>(() =>
    tokenList.length == 0 ? psudoToken : tokenList[0],
  );

  return (
    <>
      {finalize && price ? (
        <SwapQuoteView
          price={price}
          quote={quote}
          setQuote={setQuote}
          walletState={walletState}
          pkpState={pkpState}
          sellTokenInfo={sellToken}
          buyTokenInfo={buyToken}
          chainId={chainId}
        />
      ) : (
        <SwapPriceView
          price={price}
          setPrice={setPrice}
          setFinalize={setFinalize}
          setSellToken={setSellToken}
          buyToken={buyToken}
          sellToken={sellToken}
          setBuyToken={setBuyToken}
          walletState={walletState}
          pkpState={pkpState}
          chainId={chainId}
          setChainId={setChainId}
        />
      )}
    </>
  );
}

export default SwapForm;
