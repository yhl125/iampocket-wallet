import { ERC20_ABI } from '@/abi/abi';
import { WalletState } from '@/store/AddressStore';
import { PKPState } from '@/store/PKPStore';
import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { createPkpViemWalletClient } from '@/utils/EOAWalletUtil';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';
import {
  zeroDevSigner,
  zeroDevSignerWithERC20Gas,
} from '@/utils/ERC4337WalletUtil';
import { IBuyTokenInfo, IPrice, IQuote, queryQuote } from '@/utils/SwapUtil';
import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { encodeFunctionData } from 'viem';

export default function SwapQuoteView({
  price,
  quote,
  setQuote,
  walletState,
  pkpState,
  sellTokenInfo,
  buyTokenInfo,
  chainId,
}: {
  price: IPrice | undefined;
  quote: IQuote | undefined;
  setQuote: (quote: IQuote) => void;
  walletState: WalletState;
  pkpState: PKPState;
  sellTokenInfo: IResponseToken | undefined;
  buyTokenInfo: IBuyTokenInfo | undefined;
  chainId: number;
}) {
  const { tokenList } = useSnapshot(TokenStore.tokenListState);
  const [withPM, setWithPM] = useState(false);
  const [getQuote, { data: quoteData, loading: quoteLoading }] = useLazyQuery(
    queryQuote,
    {
      variables: {
        chainId: +chainId,
        sellToken: price?.sellTokenAddress,
        sellAmount: price?.sellAmount,
        buyToken: price?.buyTokenAddress,
        takerAddress:
          walletState.selectedWallet === 'zeroDev'
            ? walletState.zeroDevAddress
            : walletState.pkpViemAddress,
      },
    },
  );
  function getApproveTxData(quote: IQuote) {
    const approveData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [quote!.AllownaceTarget, quote!.sellAmount],
    });
    return approveData;
  }

  async function findQuoteAndSwap4337() {
    const signer = withPM
      ? await zeroDevSignerWithERC20Gas(
          price?.chainId === 80001 ? 'TEST_ERC20' : 'USDC',
          pkpState.currentPKP?.publicKey!,
          pkpState.sessionSigs!,
          price!.chainId,
        )
      : await zeroDevSigner(
          pkpState.currentPKP?.publicKey!,
          pkpState.sessionSigs!,
          price!.chainId,
        );
    const quoteResponse: IQuote = (await getQuote()).data.findSwapQuote;
    setQuote(quoteResponse);
    if (
      quoteResponse.AllownaceTarget !==
      '0x0000000000000000000000000000000000000000'
    ) {
      const approveTxFunctionData = getApproveTxData(quoteResponse);
      await signer
        .sendUserOperation([
          {
            target: quoteResponse.sellTokenAddress,
            data: approveTxFunctionData,
          },
          {
            target: quoteResponse.to,
            data: quoteResponse.data,
          },
        ])
        .then((res) => {
          console.log(res);
        });
    } else {
      await signer
        .sendUserOperation({
          target: quoteResponse.sellTokenAddress,
          data: quoteResponse.data,
        })
        .then((res) => {
          console.log(res);
        });
    }
  }

  async function findQuoteAndSwapEOA() {
    const pkpWalletClient = createPkpViemWalletClient(
      pkpState.currentPKP!.publicKey,
      pkpState.sessionSigs!,
      price!.chainId,
    );
    const quoteResponse: IQuote = (await getQuote()).data.findSwapQuote;
    setQuote(quoteResponse);
    await pkpWalletClient
      .sendTransaction({
        to: quoteResponse.to,
        data: quoteResponse.data,
        account: pkpWalletClient.account!,
        chain: pkpWalletClient.chain,
      })
      .then((res) => {
        console.log(res);
      });
  }

  return (
    <div>
      <h1>Review Swap Order</h1>
      <div>Sell Token Name: {sellTokenInfo?.name}</div>
      <div>Sell Token Address: {sellTokenInfo?.address}</div>
      <div>
        Amount to Sell:
        {erc20BalanceToReadable(price!.sellAmount, sellTokenInfo!.decimals)}
      </div>
      <div>Buy Token Name: {buyTokenInfo?.name}</div>
      <div>Buy Token Address: {price?.buyTokenAddress}</div>
      <div>
        Amount to Buy:
        {erc20BalanceToReadable(price!.buyAmount, buyTokenInfo!.decimals)}
      </div>
      <div>Send With Pay Master</div>
      <input
        type="checkbox"
        checked={withPM}
        onChange={() => setWithPM(true)}
        className="checkbox ml-0.5"
      />
      {walletState.selectedWallet === 'zeroDev' ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            findQuoteAndSwap4337();
          }}
        >
          Place Order
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            findQuoteAndSwapEOA();
          }}
        >
          Place Order
        </button>
      )}
    </div>
  );
}
