import { ERC20_ABI } from '@/abi/abi';
import { WalletState } from '@/store/AddressStore';
import { PKPState } from '@/store/PKPStore';
import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { publicClientOf } from '@/utils/ClientUtil';
import { createPkpViemWalletClient } from '@/utils/EOAWalletUtil';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';
import { IBuyTokenInfo, IPrice, queryPrice } from '@/utils/SwapUtil';
import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { encodeFunctionData, isAddress, parseUnits } from 'viem';

//No ChainId check since there are no whole swap token list

export default function SwapPriceView({
  price,
  setPrice,
  setFinalize,
  setSellToken,
  buyToken,
  setBuyToken,
  walletState,
  pkpState,
  chainId,
  setChainId,
}: {
  price: IPrice | undefined;
  setPrice: (price: IPrice | undefined) => void;
  setFinalize: (finalize: boolean) => void;
  setSellToken: (sellToken: IResponseToken) => void;
  buyToken: IBuyTokenInfo | undefined;
  setBuyToken: (buyToken: IBuyTokenInfo) => void;
  walletState: WalletState;
  pkpState: PKPState;
  chainId: number;
  setChainId: (chainId: number) => void;
}) {
  const { tokenList } = useSnapshot(TokenStore.tokenListState);

  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');

  const [tradeDirection, setTradeDirection] = useState('');

  const [sellTokenAddress, setSellTokenAddress] = useState('0x');
  const [buyTokenAddress, setBuyTokenAddress] = useState('0x');

  const [sellTokenDecimals, setSellTokenDecimals] = useState(1);

  const [sellTokenSymbol, setSellTokenSymbol] = useState('');

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
        sellToken: sellTokenAddress,
        sellAmount: parsedSellAmount,
        buyToken: buyTokenAddress,
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
      (token) => token.address === sellTokenAddress,
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
    if (sellTokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      setSellTokenDecimals(18);
      return;
    }
    const [symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: sellTokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }) as Promise<string>,
      publicClient.readContract({
        address: sellTokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }) as Promise<number>,
    ]);
    setSellTokenSymbol(symbol);
    setSellTokenDecimals(decimals);
  }, [chainId, sellTokenAddress]);

  const getBuyTokenSymbolAndDecimalsAndName = useCallback(async () => {
    const publicClient = publicClientOf(chainId);
    if (buyTokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      setSellTokenDecimals(18);
      return;
    }
    const [symbol, decimals, name] = await Promise.all([
      publicClient.readContract({
        address: buyTokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }) as Promise<string>,
      publicClient.readContract({
        address: buyTokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }) as Promise<number>,
      publicClient.readContract({
        address: buyTokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'name',
      }) as Promise<string>,
    ]);
    setBuyToken({ name: name, decimals: decimals, symbol: symbol });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyTokenAddress, chainId]);

  useEffect(() => {
    setPrice(priceData ? priceData.findSwapPrice : undefined);
  }, [priceData, setPrice]);

  useEffect(() => {
    if (isAddress(sellTokenAddress) && isAddress(buyTokenAddress)) {
      const selectedToken = tokenList.find(
        (token) => token.address === sellTokenAddress,
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
  }, [buyTokenAddress, sellTokenAddress]);

  /**
   * Query Price if user finished interacting with sellTokenAddress,buyTokenAddress and sellAmount,buyAmount
   * This code will keep requesting query if both buy,sell token address is filled and if user changes the sellAmount or buyAmount
   */
  useEffect(() => {
    if (
      isAddress(sellTokenAddress) &&
      isAddress(buyTokenAddress) &&
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
    sellTokenAddress,
    buyAmount,
    buyTokenAddress,
    getPrice,
    tradeDirection,
    parsedSellAmount,
    parsedBuyAmount,
    sellTokenDecimals,
    buyToken,
  ]);

  return (
    <form>
      <div>
        Chain ID:
        <input
          type="text"
          value={chainId}
          onChange={(e) => {
            setChainId(Number(e.target.value));
          }}
        ></input>
      </div>
      <div>
        Sell Token:
        <input
          type="text"
          value={sellTokenAddress}
          onChange={(e) => {
            setSellTokenAddress(e.target.value);
          }}
        ></input>
      </div>
      <div>
        Sell Amount:
        <input
          type="text"
          value={sellAmount}
          onChange={(e) => {
            setTradeDirection('sell');
            setSellAmount(e.target.value);
          }}
        ></input>
        {sellTokenSymbol}
      </div>
      <div>
        Buy Token:
        <input
          type="text"
          value={buyTokenAddress}
          onChange={(e) => {
            setBuyTokenAddress(e.target.value);
          }}
        ></input>
      </div>
      <div>
        Buy Amount:
        <input
          type="text"
          value={buyAmount}
          onChange={(e) => {
            setTradeDirection('buy');
            setBuyAmount(e.target.value);
          }}
        ></input>
        {buyToken ? buyToken.symbol : null}
      </div>
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
    </form>
  );
}

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
      address: price!.sellTokenAddress,
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
  }, [chainId, price, takerAddress]);
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
        to: price!.sellTokenAddress,
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
  useEffect(() => {
    checkAllowance();
  }, [checkAllowance, price]);
  if (
    needApprove &&
    price?.AllownaceTarget !== '0x0000000000000000000000000000000000000000' &&
    price !== undefined
  ) {
    return isBalanceSufficient() ? (
      <div>
        <button
          onClick={async (e) => {
            e.preventDefault();
            await setSellTokenApprove();
          }}
        >
          {isApproveLoading ? '...Approving' : 'Approve'}
        </button>
      </div>
    ) : (
      <div>
        <button>InSufficient Balance</button>
      </div>
    );
  } else {
    return isBalanceSufficient() ? (
      <div>
        <button onClick={onClick}>Review Trade</button>
      </div>
    ) : (
      <div>
        <button>InSufficient Balance</button>
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
  return isBalanceSufficient() &&
    price?.AllownaceTarget !== '0x0000000000000000000000000000000000000000' &&
    price !== undefined ? (
    <div>
      <button onClick={onClick}>Review Trade</button>
    </div>
  ) : (
    <div>
      <button>InSufficient Balance</button>
    </div>
  );
}
