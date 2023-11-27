import { ERC20_ABI } from '@/abi/abi';
import { WalletState } from '@/store/AddressStore';
import { PKPState } from '@/store/PKPStore';
import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { publicClientOf } from '@/utils/ClientUtil';
import { createPkpViemWalletClient } from '@/utils/EOAWalletUtil';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';
import { IBuyTokenInfo, IPrice, queryPrice } from '@/utils/swapUtil';
import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { encodeFunctionData, isAddress, parseUnits } from 'viem';
import DropDown from '../commons/DropDown';

import Text from '@/components/commons/Text';
import Icon from '@/components/commons/Icon';
import Input from '../commons/Input';
import styled from 'styled-components';
import theme from '@/styles/theme';
import Button from '../commons/Button';
import SelectChainDropDown from '../commons/SelectChainDropDown';
import { useIsMounted } from '@/hooks/useIsMounted';

//No ChainId check since there are no whole swap token list

export default function PriceView({
  price,
  setPrice,
  setFinalize,
  setSellToken,
  buyToken,
  sellToken,
  setBuyToken,
  walletState,
  pkpState,
  chainId,
  setChainId,
  psudoToken,
}: {
  price: IPrice | undefined;
  setPrice: (price: IPrice | undefined) => void;
  setFinalize: (finalize: boolean) => void;
  setSellToken: (sellToken: IResponseToken) => void;
  sellToken: IResponseToken | undefined;
  buyToken: IBuyTokenInfo | undefined;
  setBuyToken: (buyToken: IBuyTokenInfo) => void;
  walletState: WalletState;
  pkpState: PKPState;
  chainId: number;
  setChainId: (chainId: number) => void;
  psudoToken: IResponseToken;
}) {
  const { tokenList } = useSnapshot<any>(TokenStore.tokenListState);

  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');

  const [tradeDirection, setTradeDirection] = useState('');

  const [sellTokenAddress, setSellTokenAddress] = useState<any>('0x');
  const [buyTokenAddress, setBuyTokenAddress] = useState<any>('0x');

  const [sellTokenDecimals, setSellTokenDecimals] = useState(1);

  const [sellTokenSymbol, setSellTokenSymbol] = useState('');

  const mounted = useIsMounted();

  const parsedSellAmount =
    sellAmount && tradeDirection === 'sell'
      ? parseUnits(sellAmount, sellTokenDecimals).toString()
      : undefined;

  const parsedBuyAmount =
    buyAmount && tradeDirection === 'buy'
      ? parseUnits(buyAmount, buyToken!.decimals).toString()
      : undefined;

  const [getPrice, { data: priceData, loading: priceLoading }] = useLazyQuery(
    queryPrice,
    {
      variables: {
        chainId: +chainId,
        sellToken: sellTokenAddress.address,
        sellAmount: parsedSellAmount,
        buyToken: buyTokenAddress.address,
        buyAmount: parsedBuyAmount,
        takerAddress:
          walletState.selectedWallet === 'zeroDev'
            ? walletState.zeroDevAddress
            : walletState.pkpViemAddress,
      },
    },
  );

  function isBalanceSufficient() {
    const selectedToken = tokenList.find(
      (token: any) => token.address === sellTokenAddress.address,
    );
    const isSelectedSellTokenHasSufficientBalance =
      selectedToken && sellAmount
        ? parseUnits(sellAmount, sellTokenDecimals) <
          BigInt(selectedToken.balance)
        : true;
    if (isSelectedSellTokenHasSufficientBalance) {
      return true;
    } else {
      return false;
    }
  }

  // Use if token does not exist in user's tokenList
  const getSellTokenSymbolAndDecimals = useCallback(async () => {
    const publicClient = publicClientOf(chainId);
    if (
      sellTokenAddress.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    ) {
      setSellTokenDecimals(18);
      return;
    }
    const [symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: sellTokenAddress.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }) as Promise<string>,
      publicClient.readContract({
        address: sellTokenAddress.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }) as Promise<number>,
    ]);
    setSellTokenSymbol(symbol);
    setSellTokenDecimals(decimals);
  }, [chainId, sellTokenAddress.address]);

  const getBuyTokenSymbolAndDecimalsAndName = useCallback(async () => {
    const publicClient = publicClientOf(chainId);
    if (
      buyTokenAddress.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    ) {
      setSellTokenDecimals(18);
      return;
    }
    const [symbol, decimals, name] = await Promise.all([
      publicClient.readContract({
        address: buyTokenAddress.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }) as Promise<string>,
      publicClient.readContract({
        address: buyTokenAddress.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }) as Promise<number>,
      publicClient.readContract({
        address: buyTokenAddress.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'name',
      }) as Promise<string>,
    ]);
    setBuyToken({ name: name, decimals: decimals, symbol: symbol });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyTokenAddress.address, chainId]);

  useEffect(() => {
    setPrice(priceData ? priceData.findSwapPrice : undefined);
  }, [priceData, setPrice]);

  useEffect(() => {
    if (
      isAddress(sellTokenAddress.address) &&
      isAddress(buyTokenAddress.address)
    ) {
      const selectedToken = tokenList.find(
        (token: any) => token.address === sellTokenAddress.address,
      );
      if (selectedToken) {
        setSellToken(selectedToken);
        getSellTokenSymbolAndDecimals();
      } else {
        getSellTokenSymbolAndDecimals();
      }
      getBuyTokenSymbolAndDecimalsAndName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyTokenAddress.address, sellTokenAddress.address]);

  /**
   * Query Price if user finished interacting with sellTokenAddress,buyTokenAddress and sellAmount,buyAmount
   * This code will keep requesting query if both buy,sell token address is filled and if user changes the sellAmount or buyAmount
   */
  useEffect(() => {
    if (
      isAddress(sellTokenAddress.address) &&
      isAddress(buyTokenAddress.address) &&
      (sellAmount || buyAmount)
    ) {
      if (
        tradeDirection === 'sell' &&
        parsedSellAmount &&
        parsedSellAmount !== '0'
      ) {
        getPrice()
          .then((res) => {
            if (res.data === null) {
              throw new Error('There has been error' + res.error);
            }
            const findSwapPrice: IPrice = res.data.findSwapPrice;
            setPrice(findSwapPrice);
            setBuyAmount(
              String(
                erc20BalanceToReadable(
                  findSwapPrice.buyAmount,
                  buyToken!.decimals,
                ),
              ),
            );
          })
          .catch((err) => console.log(err));
      } else if (
        tradeDirection === 'buy' &&
        parsedBuyAmount &&
        parsedBuyAmount !== '0'
      ) {
        getPrice()
          .then((res) => {
            if (res.data === null) {
              throw new Error('There has been error' + res.error);
            }
            const findSwapPrice: IPrice = res.data.findSwapPrice;
            setPrice(findSwapPrice);
            setSellAmount(
              String(
                erc20BalanceToReadable(
                  findSwapPrice.sellAmount,
                  sellTokenDecimals,
                ),
              ),
            );
          })
          .catch((err) => console.log(err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sellAmount,
    sellTokenAddress.address,
    buyAmount,
    buyTokenAddress.address,
    getPrice,
    tradeDirection,
    parsedSellAmount,
    parsedBuyAmount,
    sellTokenDecimals,
    buyToken,
  ]);

  //========button========//

  function ApporveOrReviewButtonEOA({
    onClick,
    isBalanceSufficient,
    pkpState,
    price,
    chainId,
    takerAddress,
  }: {
    onClick: () => void;
    isBalanceSufficient: () => boolean;
    pkpState: PKPState;
    price?: IPrice;
    chainId: number;
    takerAddress: string;
  }) {
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [needApprove, setNeedApprove] = useState(true);

    const checkAllowance = useCallback(async () => {
      const publicClient = publicClientOf(chainId);
      const allowance = (await publicClient.readContract({
        address: price!.sellTokenAddress.address,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [takerAddress, price!.AllownaceTarget],
      })) as bigint;
      if (allowance === 0n || allowance < BigInt(price!.sellAmount)) {
        console.log(allowance);
        setNeedApprove(true);
      } else if (
        allowance === BigInt(price!.sellAmount) ||
        allowance > BigInt(price!.sellAmount)
      ) {
        console.log(allowance);
        setNeedApprove(false);
      }
    }, [price]);
    async function setSellTokenApprove() {
      setIsApproveLoading(true);
      const pkpWalletClient = createPkpViemWalletClient(
        pkpState.currentPKP!.publicKey,
        pkpState.sessionSigs!,
        chainId,
      );
      const approveData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [price!.AllownaceTarget, price!.sellAmount],
      });
      pkpWalletClient
        .sendTransaction({
          to: price!.sellTokenAddress.address,
          account: pkpWalletClient.account!,
          chain: pkpWalletClient.chain,
          data: approveData,
        })
        .then((res) => {
          setIsApproveLoading(false);
          setNeedApprove(false);
          console.log(res);
          return res;
        });
    }

    const checkDisable = () => {
      if (isBalanceSufficient()) {
        if (isApproveLoading) return true;
        else return false;
      } else {
        return false;
      }
    };
    useEffect(() => {
      checkAllowance();
    }, [checkAllowance, price]);
    if (
      needApprove &&
      price?.AllownaceTarget !== '0x0000000000000000000000000000000000000000' &&
      price !== undefined
    ) {
      return (
        <Button
          text={
            isBalanceSufficient()
              ? 'InSufficient Balance'
              : isApproveLoading
                ? 'Approving...'
                : 'Approve'
          }
          size="large"
          type="primary"
          disabled={
            isBalanceSufficient() ? true : isApproveLoading ? true : false
          }
          onClick={async (e: any) => {
            e.preventDefault();
            await setSellTokenApprove();
          }}
        />
      );
    } else {
      return (
        <div>
          <Button
            text={
              isBalanceSufficient() ? 'Review Trade' : 'InSufficient Balance'
            }
            size="large"
            type="primary"
            disabled={isBalanceSufficient() ? false : true}
            onClick={onClick}
          />
        </div>
      );
    }
  }

  function ReviewButton4337({
    price,
    isBalanceSufficient,
    onClick,
  }: {
    price?: IPrice;
    isBalanceSufficient: () => boolean;
    onClick: () => void;
  }) {
    return (
      isBalanceSufficient() &&
      price?.AllownaceTarget !==
        '0x0000000000000000000000000000000000000000' && (
        <div>
          <Button
            text={price !== undefined ? 'Review Trade' : 'InSufficient Balance'}
            size="large"
            type="primary"
            disabled={price !== undefined ? false : true}
            onClick={onClick}
          />
        </div>
      )
    );
  }

  return (
    <>
      {mounted && (
        <Container>
          <SelectChainWrapper>
            <Text size="body1" color="bg40">
              Select Chain
            </Text>
            <ChainDropDownWrapper>
              <SelectChainDropDown setChainId={setChainId} />
            </ChainDropDownWrapper>
          </SelectChainWrapper>

          <InputWrapper>
            <DropDownWrapper>
              <DropDown
                contents={tokenList}
                selectContentState={sellTokenAddress}
                setSelectContentState={setSellTokenAddress}
                iconKey="logoUrl"
                nameKey="name"
                size="medium"
              />
            </DropDownWrapper>
            <StyledInput
              type="text"
              dir="rtl"
              value={sellAmount}
              onChange={(e: any) => {
                setTradeDirection('sell');
                setSellAmount(e.target.value);
              }}
              placeholder="0"
            />
          </InputWrapper>

          <DividerWrapper>
            <Divider />
            <IconWrapper>
              <Icon type="swap" height={40} />
            </IconWrapper>
          </DividerWrapper>

          <InputWrapper>
            <DropDownWrapper>
              <DropDown
                contents={tokenList}
                selectContentState={buyTokenAddress}
                setSelectContentState={setBuyTokenAddress}
                iconKey="logoUrl"
                nameKey="name"
                size="medium"
              />
            </DropDownWrapper>
            <StyledInput
              type="text"
              dir="rtl"
              value={buyAmount}
              onChange={(e: any) => {
                setTradeDirection('buy');
                setBuyAmount(e.target.value);
              }}
              placeholder="0"
            />
          </InputWrapper>

          {walletState.selectedWallet === 'zeroDev' ? (
            <ReviewButton4337
              price={price}
              isBalanceSufficient={isBalanceSufficient}
              onClick={() => setFinalize(true)}
            ></ReviewButton4337>
          ) : (
            <ApporveOrReviewButtonEOA
              onClick={() => setFinalize(true)}
              isBalanceSufficient={isBalanceSufficient}
              pkpState={pkpState}
              price={price}
              chainId={chainId}
              takerAddress={walletState.pkpViemAddress}
            />
          )}
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  row-gap: ${theme.space.medium};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SelectChainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  row-gap: ${theme.space.xTiny};
`;

const ChainDropDownWrapper = styled.div`
  width: 30%;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DropDownWrapper = styled.div`
  width: 30%;
`;
const StyledInput = styled.input`
  width: 100%;
  color: ${theme.color.bg0};
  font-size: ${theme.fontSize.title1};
  line-height: ${theme.lineHeight.title1};
  font-weight: 700;
  &::placeholder {
    color: ${theme.color.bg30};
  }
`;

const DividerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0px;
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
