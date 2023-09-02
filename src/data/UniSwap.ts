import { providerOf } from '@/utils/ProviderUtil';
import { Token } from '@uniswap/sdk-core';
import { ZeroDevSigner } from '@zerodevapp/sdk';
import { BigNumber, ethers } from 'ethers';

export const WETH_TOKEN = new Token(
  10,
  '0x4200000000000000000000000000000000000006',
  18,
  'WETH',
  'Wrapped Ether',
);

export const USDC_TOKEN = new Token(
  10,
  '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
  6,
  'USDC',
  'USD//C',
);

export const DAI_TOKEN = new Token(
  10,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai Stablecoin',
);

export const USDT_TOKEN = new Token(
  10,
  '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  6,
  'USDT',
  'USD//T',
);

export enum TransactionState {
  Failed = 'Failed',
  New = 'New',
  Rejected = 'Rejected',
  Sending = 'Sending',
  Sent = 'Sent',
}

export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;

export const V3_SWAP_ROUTER_ADDRESS =
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 0.03;

export async function sendTransactionViaWallet(
  transaction: ethers.providers.TransactionRequest,
  signer: ZeroDevSigner,
): Promise<TransactionState> {
  const provider = providerOf(10);
  if (!provider) {
    return TransactionState.Failed;
  }

  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value);
  }

  const txRes = await signer.sendTransaction(transaction);
  let receipt = null;

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash);

      if (receipt === null) {
        continue;
      }
    } catch (e) {
      console.log(`Receipt error:`, e);
      break;
    }
  }

  if (receipt) {
    return TransactionState.Sent;
  } else {
    return TransactionState.Failed;
  }
}
