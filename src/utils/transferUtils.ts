import { ERC20_ABI } from '@/abi/abi';
import { parseEther } from '@ethersproject/units';
import { ethers } from 'ethers';
import {
  getERC4337Signer,
  getERC4337SignerWithERC20Gas,
} from './ERC4337WalletUtil';
import { SessionSigs } from '@lit-protocol/types';
import { providerOf } from './ProviderUtil';

export const transfer = async (
  targetAddress: string,
  amount: string,
  withPM: Boolean,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number,
) => {
  const signer = withPM
    ? await getERC4337SignerWithERC20Gas(
        'TEST_ERC20',
        pkpPubKey,
        sessionSigs,
        chainId,
      )
    : await getERC4337Signer(pkpPubKey, sessionSigs, chainId);

  const provider = providerOf(chainId);
  const feeData = await provider.getFeeData();

  const target = ethers.utils.getAddress(targetAddress);
  const value = ethers.utils.parseEther(amount);
  const res = await signer.sendTransaction({
    to: target,
    value: value,
    gasPrice: feeData.gasPrice ?? 1000000000,
    maxFeePerGas: feeData.maxFeePerGas ?? 1000000000,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? 1000000000,
    gasLimit: 33100,
  });

  console.log(`Transaction hash: ${res.hash}`);
  const ev = await res.wait();
  console.log(`Transaction done: ${ev.transactionHash}`);
  return res;
};

export const getEstimateGas = async (
  provider: ethers.providers.JsonRpcProvider,
  fromAddress: string,
  toAddress: string,
  amount: string,
) => {
  return await provider.estimateGas({
    from: fromAddress,
    to: toAddress,
    value: parseEther(amount),
  });
};

export const erc20Transfer = async (
  tokenAddress: string,
  targetAddress: string,
  amountToSend: string,
  withPM: boolean,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chaindId: number,
) => {
  const signer = withPM
    ? await getERC4337SignerWithERC20Gas(
        'TEST_ERC20',
        pkpPubKey,
        sessionSigs,
        chaindId,
      )
    : await getERC4337Signer(pkpPubKey, sessionSigs, chaindId);

  const provider = providerOf(chaindId);
  const feeData = await provider.getFeeData();

  const token = ethers.utils.getAddress(tokenAddress);
  const to = ethers.utils.getAddress(targetAddress);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.utils.parseUnits(amountToSend, decimals);
  console.log(`Transferring ${amountToSend} ${symbol}...`);

  const res = await signer.sendTransaction({
    to: erc20.address,
    value: 0,
    data: erc20.interface.encodeFunctionData('transfer', [to, amount]),
    gasPrice: feeData.gasPrice ?? 1000000000,
    maxFeePerGas: feeData.maxFeePerGas ?? 1000000000,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? 1000000000,
    gasLimit: 33100,
  });

  console.log(`Transaction hash: ${res.hash}`);
  const ev = await res.wait();
  console.log(`Transaction done: ${ev.transactionHash}`);
  return res;
};
