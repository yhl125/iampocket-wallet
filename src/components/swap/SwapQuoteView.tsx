import { useLazyQuery } from '@apollo/client';
import { useSnapshot } from 'valtio';
import { encodeFunctionData } from 'viem';
import { useRouter } from 'next/navigation';

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

import Text from '@/components/commons/Text';
import Icon from '@/components/commons/Icon';
import styled from 'styled-components';
import theme from '@/styles/theme';
import Button from '../commons/Button';
import TokenImage from '../commons/TokenImage';
import { useState } from 'react';

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
  const router = useRouter();
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
          router.push('/wallet');
        });
    } else {
      await signer
        .sendUserOperation({
          target: quoteResponse.sellTokenAddress,
          data: quoteResponse.data,
        })
        .then((res) => {
          console.log(res);
          router.push('/wallet');
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
      .then((res: any) => {
        console.log(res);
        router.push('/wallet');
      });
  }
  return (
    <Container>
      <Text size="title2" color="bg40">
        Review Swap Order
      </Text>
      <ReviewBox>
        <ReviewWrapper>
          <TokenAmountWrapper>
            <Text size="title3" color="bg40">
              From
            </Text>
            <AmountWrapper>
              <Text size="title1" $bold>
                {erc20BalanceToReadable(
                  price!.sellAmount,
                  sellTokenInfo!.decimals,
                )}
              </Text>
              <TokenWrapper>
                <TokenImage
                  logoUrl={sellTokenInfo?.logoUrl!}
                  address={sellTokenInfo?.address!}
                />
                <Text size="title2">{sellTokenInfo?.name}</Text>
              </TokenWrapper>
            </AmountWrapper>
          </TokenAmountWrapper>
          <DividerWrapper>
            <Divider />
            <IconWrapper>
              <Icon type="swap" height={40} />
            </IconWrapper>
          </DividerWrapper>
          <TokenAmountWrapper>
            <Text size="title3" color="bg40">
              To
            </Text>
            <AmountWrapper>
              <Text size="title1" $bold>
                {erc20BalanceToReadable(
                  price!.buyAmount,
                  buyTokenInfo!.decimals,
                )}
              </Text>
              <TokenWrapper>
                <TokenImage logoUrl={'/PlaceHolder'} address={price!.buyTokenAddress!} />
                <Text size="title2">{buyTokenInfo?.name}</Text>
              </TokenWrapper>
            </AmountWrapper>
          </TokenAmountWrapper>
        </ReviewWrapper>
      </ReviewBox>
      {walletState.selectedWallet === 'zeroDev' ? (
        <Button
          text="Place Order"
          size="large"
          type="primary"
          onClick={(e: any) => {
            e.preventDefault();
            findQuoteAndSwap4337();
          }}
        />
      ) : (
        <Button
          text="Place Order"
          size="large"
          type="primary"
          onClick={(e: any) => {
            e.preventDefault();
            findQuoteAndSwapEOA();
          }}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DividerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 42px 0px;
`;
const IconWrapper = styled.div`
  background-color: ${theme.color.bg50};
  border-radius: 50%;
  padding: 10px;
  transform: rotate(-90deg);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

const Divider = styled.div`
  background-color: ${theme.color.bg50};
  height: 1px;
  width: 100%;
  position: relative;
`;

const ReviewBox = styled.div`
  border-radius: 5px;
  height: 391px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.color.bg40};
  padding: ${theme.space.large};
  margin-top: ${theme.space.xSmall};
  margin-bottom: ${theme.space.medium};
`;
const ReviewWrapper = styled.div`
  width: 100%;
`;

const TokenAmountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: ${theme.space.small};
`;

const AmountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TokenWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${theme.space.xSmall};
`;
