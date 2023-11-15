'use client';
import AddressStore from '@/store/AddressStore';
import PKPStore from '@/store/PKPStore';
import { IResponseToken } from '@/store/TokenStore';
import { IBuyTokenInfo, IPrice, IQuote } from '@/utils/swapUtil';
import { useState } from 'react';
import { useSnapshot } from 'valtio';
import QuoteView from './QuoteView';
import PriceView from './PriceView';
import { useIsMounted } from '@/hooks/useIsMounted';

function SwapForm() {
  const walletState = useSnapshot(AddressStore.state);
  const pkpState = useSnapshot(PKPStore.state);

  const [chainId, setChainId] = useState(80001);

  const [finalize, setFinalize] = useState(false);

  const mounted = useIsMounted();

  const [price, setPrice] = useState<IPrice | undefined>();
  const [quote, setQuote] = useState<IQuote | undefined>();

  const [sellToken, setSellToken] = useState<IResponseToken | undefined>();
  const [buyToken, setBuyToken] = useState<IBuyTokenInfo | undefined>();

  return (
    <>
      {mounted && finalize && price ? (
        <QuoteView
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
        <PriceView
          price={price}
          setPrice={setPrice}
          setFinalize={setFinalize}
          setSellToken={setSellToken}
          buyToken={buyToken}
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
