'use client';

import {
  ERC20_ABI,
  PopulatedTransaction,
  WETH_ABI,
  fromReadableAmount,
} from '@/abi/abi';
import PKPStore from '@/store/PKPStore';
import { zeroDevSigner } from '@/utils/ERC4337WalletUtil';
import { providerOf } from '@/utils/ProviderUtil';
import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import {
  AlphaRouter,
  SwapOptionsSwapRouter02,
  SwapType,
} from '@uniswap/smart-order-router';
import { ethers } from 'ethers';
import { useSnapshot } from 'valtio';
import { Token } from '@uniswap/sdk-core';
import {
  DAI_TOKEN,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
  USDC_TOKEN,
  USDT_TOKEN,
  V3_SWAP_ROUTER_ADDRESS,
  WETH_TOKEN,
} from '@/data/UniSwap';

export default function StablePage() {
  const { sessionSigs, currentPKP } = useSnapshot(PKPStore.state);

  async function getTokenTransferApproval(
    token: Token,
  ): Promise<PopulatedTransaction> {
    const signer = await zeroDevSigner(currentPKP!.publicKey, sessionSigs!, 10);
    const provider = providerOf(10);
    const address = signer.address;

    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider,
    );

    const transaction = await tokenContract.populateTransaction.approve(
      V3_SWAP_ROUTER_ADDRESS,
      fromReadableAmount(
        TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
        token.decimals,
      ).toString(),
    );

    const approvalTransactionRequest = {
      ...transaction,
      from: address,
    } as PopulatedTransaction;
    return approvalTransactionRequest;
  }

  const swapWethToUsdcUsdtDai = async () => {
    const signer = await zeroDevSigner(currentPKP!.publicKey, sessionSigs!, 10);
    const router = new AlphaRouter({
      chainId: 10,
      provider: providerOf(10),
    });
    const wethContract = new ethers.Contract(
      '0x4200000000000000000000000000000000000006',
      WETH_ABI,
      signer,
    );

    const options: SwapOptionsSwapRouter02 = {
      recipient: await signer.getAddress(),
      slippageTolerance: new Percent(50, 10_000),
      deadline: Math.floor(Date.now() / 1000 + 1800),
      type: SwapType.SWAP_ROUTER_02,
    };
    const routeToUsdc = await router.route(
      CurrencyAmount.fromRawAmount(
        WETH_TOKEN,
        fromReadableAmount(0.001, WETH_TOKEN.decimals).toString(),
      ),
      USDC_TOKEN,
      TradeType.EXACT_INPUT,
      options,
    );
    const routeToUsdt = await router.route(
      CurrencyAmount.fromRawAmount(
        WETH_TOKEN,
        fromReadableAmount(0.001, WETH_TOKEN.decimals).toString(),
      ),
      USDT_TOKEN,
      TradeType.EXACT_INPUT,
      options,
    );
    const routeToDai = await router.route(
      CurrencyAmount.fromRawAmount(
        WETH_TOKEN,
        fromReadableAmount(0.001, WETH_TOKEN.decimals).toString(),
      ),
      DAI_TOKEN,
      TradeType.EXACT_INPUT,
      options,
    );
    const tokenApprovalTx = await getTokenTransferApproval(WETH_TOKEN);

    const initUsdcSwapTx = {
      data: routeToUsdc!.methodParameters?.calldata!,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: routeToUsdc?.methodParameters?.value!,
    };

    const initUsdtSwapTx = {
      data: routeToUsdt!.methodParameters?.calldata!,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: routeToUsdt?.methodParameters?.value!,
    };

    const initDaiSwapTx = {
      data: routeToDai!.methodParameters?.calldata!,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: routeToDai?.methodParameters?.value!,
    };

    const res = await signer.execBatch([
      wethContract.deposit({
        from: signer.address,
        value: ethers.utils.parseEther('0.003'),
      }),
      tokenApprovalTx,
      initUsdcSwapTx,
      initUsdtSwapTx,
      initDaiSwapTx,
    ]);
    console.log(res);
    const tx = await res.wait();
    console.log(tx);
  };

  const handleClick = async () => {
    swapWethToUsdcUsdtDai();
  };

  return (
    <div>
      <h1>Stable Page</h1>
      <button
        className="btn"
        onClick={() => {
          handleClick();
        }}
      >
        swap eth to weth
      </button>
    </div>
  );
}
