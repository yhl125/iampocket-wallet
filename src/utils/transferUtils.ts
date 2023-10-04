import { ERC20_ABI } from '@/abi/abi';
import { parseEther } from '@ethersproject/units';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import {
  biconomySmartAccount,
  pkpEthersWalletSigner,
  zeroDevSigner,
  zeroDevSignerWithERC20Gas,
} from './ERC4337WalletUtil';
import { SessionSigs } from '@lit-protocol/types';
import { providerOf } from './ProviderUtil';

export async function zeroDevTransfer(
  recipientAddress: string,
  amount: string,
  withPM: Boolean,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number,
) {
  const signer = withPM
    ? await zeroDevSignerWithERC20Gas(
        'TEST_ERC20',
        pkpPubKey,
        sessionSigs,
        chainId,
      )
    : await zeroDevSigner(pkpPubKey, sessionSigs, chainId);

  const provider = providerOf(chainId);
  const feeData = await provider.getFeeData();
  const target = ethers.utils.getAddress(recipientAddress) as `0x${string}`;
  const value = ethers.utils.parseEther(amount).toBigInt();
  // const res = await signer.sendUserOperation({
  //   target: target,
  //   value: value,
  //   gasPrice: feeData.gasPrice ?? undefined,
  //   maxFeePerGas: feeData.maxFeePerGas ?? undefined,
  //   maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? undefined,
  //   gasLimit: 33100,
  // });
  const result = await signer.sendUserOperation({
    target: target,
    data: '0x',
    value: value,
  });

  console.log(`Transaction hash: ${result.hash}`);
}

export async function getEstimateGas(
  provider: ethers.providers.JsonRpcProvider,
  fromAddress: string,
  toAddress: string,
  amount: string,
) {
  return await provider.estimateGas({
    from: fromAddress,
    to: toAddress,
    value: parseEther(amount),
  });
}

export async function zeroDevErc20Transfer(
  tokenAddress: string,
  recipientAddress: string,
  amount: string,
  withPM: boolean,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number,
) {
  const signer = withPM
    ? await zeroDevSignerWithERC20Gas(
        'TEST_ERC20',
        pkpPubKey,
        sessionSigs,
        chainId,
      )
    : await zeroDevSigner(pkpPubKey, sessionSigs, chainId);

  const provider = providerOf(chainId);
  const feeData = await provider.getFeeData();

  const token = ethers.utils.getAddress(tokenAddress);
  const to = ethers.utils.getAddress(recipientAddress);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const parsedAmount = ethers.utils.parseUnits(amount, decimals);
  console.log(`Transferring ${parsedAmount} ${symbol}...`);

  // const res = await signer.sendUserOperationf({
  //   to: erc20.address,
  //   value: 0,
  //   data: erc20.interface.encodeFunctionData('transfer', [to, parsedAmount]),
  //   gasPrice: feeData.gasPrice ?? undefined,
  //   maxFeePerGas: feeData.maxFeePerGas ?? undefined,
  //   maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? undefined,
  //   gasLimit: 33100,
  // });
  const res = await signer.sendUserOperation({
    target: erc20.address as `0x${string}`,
    data: erc20.interface.encodeFunctionData('transfer', [
      to,
      parsedAmount,
    ]) as `0x${string}`,
  });

  console.log(`Transaction hash: ${res.hash}`);
}

export async function biconomyTransfer(
  recipientAddress: string,
  amount: string,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number,
) {
  const biconomyAccount = await biconomySmartAccount(
    pkpPubKey,
    sessionSigs,
    chainId,
  );
  const transaction = {
    to: recipientAddress,
    data: '0x',
    value: ethers.utils.parseEther(amount.toString()),
  };
  const userOp = await biconomyAccount.buildUserOp([transaction]);
  const userOpResponse = await biconomyAccount.sendUserOp(userOp);
  console.log(`userOp Hash: ${userOpResponse.userOpHash}`);
  const transactionDetails = await userOpResponse.wait();
  console.log(`Transaction done: ${transactionDetails.userOpHash}`);
  return transactionDetails.receipt;
}

export async function biconomyErc20Transfer(
  tokenAddress: string,
  recipientAddress: string,
  amount: string,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number,
) {
  const biconomyAccount = await biconomySmartAccount(
    pkpPubKey,
    sessionSigs,
    chainId,
  );
  // generate ERC20 transfer data
  // Encode an ERC-20 token transfer to recipient of the specified amount
  const provider = providerOf(chainId);
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  let decimals = 18;
  try {
    decimals = await tokenContract.decimals();
  } catch (error) {
    throw new Error('invalid token address supplied');
  }
  const amountGwei = ethers.utils.parseUnits(amount, decimals);
  const data = (
    await tokenContract.populateTransaction.transfer(
      recipientAddress,
      amountGwei,
    )
  ).data;
  const transaction = {
    to: tokenAddress,
    data,
  };
  const userOp = await biconomyAccount.buildUserOp([transaction]);
  const userOpResponse = await biconomyAccount.sendUserOp(userOp);
  console.log(`userOp Hash: ${userOpResponse.userOpHash}`);
  const transactionDetails = await userOpResponse.wait();
  console.log(`Transaction done: ${transactionDetails.userOpHash}`);
  return transactionDetails.receipt;
}

export async function pkpEthersTransfer(
  to: string,
  amount: string,
  chainId: number,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
) {
  const pkpEthersWallet = await pkpEthersWalletSigner(
    pkpPubKey,
    sessionSigs,
    chainId,
  );
  const transactionRequest = {
    to,
    value: ethers.utils.parseEther(amount),
  };
  const result = await pkpEthersWallet.sendTransaction(transactionRequest);
  console.log(result);
}

export async function pkpEthersErc20Transfer(
  tokenAddress: string,
  recipientAddress: string,
  amount: string,
  chainId: number,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
) {
  const pkpEthersWallet = await pkpEthersWalletSigner(
    pkpPubKey,
    sessionSigs,
    chainId,
  );
  const provider = providerOf(chainId);
  const feeData = await provider.getFeeData();

  const token = ethers.utils.getAddress(tokenAddress);
  const to = ethers.utils.getAddress(recipientAddress);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const parsedAmount = ethers.utils.parseUnits(amount, decimals);
  console.log(`Transferring ${parsedAmount} ${symbol}...`);
  console.log(pkpEthersWallet.address);
  const res = await pkpEthersWallet.sendTransaction({
    to: erc20.address,
    value: 0,
    data: erc20.interface.encodeFunctionData('transfer', [to, parsedAmount]),
    gasPrice: feeData.gasPrice ?? undefined,
    maxFeePerGas: feeData.maxFeePerGas ?? undefined,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? undefined,
  });
  console.log(`Transaction hash: ${res.hash}`);
  const ev = await res.wait();
  console.log(`Transaction done: ${ev.transactionHash}`);
  return res;
}
