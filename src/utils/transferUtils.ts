import { ERC20_ABI } from '@/abi/abi';
import {
  createPkpViemWalletClient,
  zeroDevSigner,
  zeroDevSignerWithERC20Gas,
} from './ERC4337WalletUtil';
import { SessionSigs } from '@lit-protocol/types';
import { publicClientOf } from './ClientUtil';
import {
  parseEther,
  getAddress,
  parseUnits,
  getContract,
  encodeFunctionData,
} from 'viem';

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

  const target = getAddress(recipientAddress) as `0x${string}`;
  const value = parseEther(amount);
  const result = await signer.sendUserOperation({
    target: target,
    data: '0x',
    value: value,
  });

  console.log(`Transaction hash: ${result.hash}`);
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

  const publicClient = publicClientOf(chainId);

  const token = getAddress(tokenAddress);
  const to = getAddress(recipientAddress);
  const erc20 = getContract({
    address: token,
    abi: ERC20_ABI,
    publicClient: publicClient,
  });
  const [symbol, decimals] = await Promise.all([
    publicClient.readContract({
      address: token,
      abi: ERC20_ABI,
      functionName: 'symbol',
    }),
    publicClient.readContract({
      address: token,
      abi: ERC20_ABI,
      functionName: 'decimals',
    }) as unknown as number,
  ]);

  const parsedAmount = parseUnits(amount, decimals);
  const erc20TransferFunctionData = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [to, parsedAmount],
  });

  console.log(`Transferring ${parsedAmount} ${symbol}...`);
  const result = await signer.sendUserOperation({
    target: erc20.address,
    data: erc20TransferFunctionData,
  });

  console.log(`Transacion Hash: ${result.hash}`);
}

export async function pkpViemTransfer(
  to: `0x${string}`,
  amount: string,
  chainId: number,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
) {
  const walletClient = createPkpViemWalletClient(
    pkpPubKey,
    sessionSigs,
    chainId,
  );
  const hash = await walletClient.sendTransaction({
    account: walletClient.account!,
    to: to,
    value: parseEther(amount),
    chain: walletClient.chain,
  });
  console.log(hash);
}

export async function pkpViemErc20Transfer(
  tokenAddress: string,
  recipientAddress: string,
  amount: string,
  chainId: number,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
) {
  const publicClient = publicClientOf(chainId);
  const pkpWalletClient = createPkpViemWalletClient(
    pkpPubKey,
    sessionSigs,
    chainId,
  );
  //Get gasPrice, maxFeePerGas, maxPriorityFeePerGas
  // const { maxFeePerGas, maxPriorityFeePerGas, gasPrice } =
  //   await publicClient.estimateFeesPerGas();

  //Get ERC-20 Token Contract and Functions or transfer
  const token = getAddress(tokenAddress);
  const to = getAddress(recipientAddress);
  const erc20 = getContract({
    address: token,
    abi: ERC20_ABI,
    publicClient: publicClient,
  });
  const [symbol, decimals] = await Promise.all([
    publicClient.readContract({
      address: token,
      abi: ERC20_ABI,
      functionName: 'symbol',
    }),
    publicClient.readContract({
      address: token,
      abi: ERC20_ABI,
      functionName: 'decimals',
    }) as unknown as number,
  ]);

  const parsedAmount = parseUnits(amount, decimals);
  const erc20TransferFunctionData = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [to, parsedAmount],
  });
  console.log(`Transferring ${parsedAmount} ${symbol}...`);
  const result = await pkpWalletClient.sendTransaction({
    account: pkpWalletClient.account!,
    to: erc20.address,
    value: parseEther('0'),
    data: erc20TransferFunctionData,
    chain: pkpWalletClient.chain,
  });
}
