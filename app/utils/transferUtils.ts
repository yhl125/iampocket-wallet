import { ERC20_ABI } from '@/api/src/abi';
import { parseEther } from '@ethersproject/units';
import { ethers } from 'ethers';
import { Client, Presets } from 'userop';
import config from '../../config.json';

export const transfer = async (
  targetAddress: string,
  amount: string,
  withPM: Boolean
) => {
  const paymaster = withPM
    ? Presets.Middleware.verifyingPaymaster(
        config.paymaster.rpcUrl,
        config.paymaster.context
      )
    : undefined;
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    config.signingKey,
    config.rpcUrl,
    config.entryPoint,
    config.simpleAccountFactory,
    paymaster
  );
  const client = await Client.init(config.rpcUrl, config.entryPoint);
  console.log(client);
  const target = ethers.utils.getAddress(targetAddress);
  const value = ethers.utils.parseEther(amount);
  const res = await client.sendUserOperation(
    simpleAccount.execute(target, value, '0x'),
    { onBuild: (op) => console.log('Signed UserOperation:', op) }
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log('Waiting for transaction...');
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
};

export const getEstimateGas = async (
  provider: ethers.providers.JsonRpcProvider,
  fromAddress: string,
  toAddress: string,
  amount: string
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
  withPM: boolean
) => {
  const paymaster = withPM
    ? Presets.Middleware.verifyingPaymaster(
        config.paymaster.rpcUrl,
        config.paymaster.context
      )
    : undefined;
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    config.signingKey,
    config.rpcUrl,
    config.entryPoint,
    config.simpleAccountFactory,
    paymaster
  );
  const client = await Client.init(config.rpcUrl, config.entryPoint);

  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const token = ethers.utils.getAddress(tokenAddress);
  const to = ethers.utils.getAddress(targetAddress);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.utils.parseUnits(amountToSend, decimals);
  console.log(`Transferring ${amountToSend} ${symbol}...`);

  const res = await client.sendUserOperation(
    simpleAccount.execute(
      erc20.address,
      0,
      erc20.interface.encodeFunctionData('transfer', [to, amount])
    ),
    { onBuild: (op) => console.log('Signed UserOperation:', op) }
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log('Waiting for transaction...');
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
};
