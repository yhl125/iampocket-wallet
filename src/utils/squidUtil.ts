import { Squid } from '@0xsquid/sdk';
import { zeroDevSigner, zeroDevSignerWithERC20Gas } from './ERC4337WalletUtil';
import { SessionSigs } from '@lit-protocol/types';
import { ethers } from 'ethers';
import { ERC20_ABI } from '@/abi/abi';
import { providerOf } from './ProviderUtil';
import { ChainData, TokenData } from '@/data/SquidData';
export interface SquidTransactionParams {
  selectedFromChain: ChainData;
  selectedToChain: ChainData;
  selectedFromToken: TokenData;
  selectedToToken: TokenData;
  sendAmount: string;
  pkpPubKey: string;
  sessionSigs: SessionSigs;
  // withPM: boolean = false,
  withPM: boolean;
  squid: Squid;
}
export async function squidTransaction({
  selectedFromChain,
  selectedToChain,
  selectedFromToken,
  selectedToToken,
  sendAmount,
  pkpPubKey,
  sessionSigs,
  withPM,
  squid,
}: SquidTransactionParams) {
  const signer = withPM
    ? await zeroDevSignerWithERC20Gas(
        'TEST_ERC20',
        pkpPubKey,
        sessionSigs,
        +selectedFromChain.chainId,
      )
    : await zeroDevSigner(pkpPubKey, sessionSigs, +selectedFromChain.chainId);
  const address = await signer.getAddress();

  const getRouteParams = {
    fromChain: selectedFromChain.chainId,
    toChain: selectedToChain.chainId,
    fromToken: selectedFromToken.address,
    toToken: selectedToToken.address,
    fromAmount: ethers.utils
      .parseUnits(sendAmount, selectedFromToken.decimals)
      .toHexString(),
    toAddress: address,
    slippage: 5.0,
  };
  await squid.init();
  const { route } = await squid.getRoute(getRouteParams);
  const transactionRequest = route.transactionRequest!;
  const squidTx = {
    to: transactionRequest.targetAddress,
    data: transactionRequest.data,
    gasLimit: 33100,
  };

  const nativeTokenConstant = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

  if (selectedFromToken.address === nativeTokenConstant) {
     const res = await signer.sendTransaction(squidTx);
     console.log(`Transaction hash: ${res.hash}`);
     const ev = await res.wait();
     console.log(`Transaction done: ${ev.transactionHash}`);
     return res;
  } else {
    const fromTokenContract = new ethers.Contract(
      selectedFromToken.address,
      ERC20_ABI,
      providerOf(+selectedFromChain.chainId),
    );

    const approve = {
      to: selectedFromToken.address,
      data: fromTokenContract.interface.encodeFunctionData('approve', [
        transactionRequest.targetAddress,
        ethers.BigNumber.from(sendAmount),
      ]),
      gasLimit: 33100,
    };
    const res = await signer.execBatch([approve, squidTx]);
    const ev = await res.wait();
    console.log(`Transaction done: ${ev.transactionHash}`);
    return res;
  }
}
