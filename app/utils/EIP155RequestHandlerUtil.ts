import { EIP155_SIGNING_METHODS } from '@/data/EIP155Data';
import {
  getSignParamsMessage,
  getSignTypedDataParamsData,
} from '@/utils/HelperUtil';
import { SignClientTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { Wallet, providers } from 'ethers';
import config from 'config.json';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
} from '@walletconnect/jsonrpc-utils';
import { getERC4337Wallet } from './ERC4337WalletUtil';
import { Client, DEFAULT_CALL_GAS_LIMIT } from 'userop';

export async function approveEIP155Request(
  requestEvent: SignClientTypes.EventArguments['session_request']
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const provider = new providers.JsonRpcProvider(config.rpcUrl);
  const signer = new Wallet(config.signingKey, provider);
  const erc4337Wallet = await getERC4337Wallet();
  const client = await Client.init(config.rpcUrl, config.entryPoint);

  // https://discord.com/channels/874596133148696576/942772249662996520/1100391863002878054
  erc4337Wallet.setCallGasLimit(DEFAULT_CALL_GAS_LIMIT.mul(2));

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      const message = getSignParamsMessage(request.params);
      const signedMessage = await signer.signMessage(message);
      return formatJsonRpcResult(id, signedMessage);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      const {
        domain,
        types,
        message: data,
      } = getSignTypedDataParamsData(request.params);
      // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
      delete types.EIP712Domain;
      const signedData = await signer._signTypedData(domain, types, data);
      return formatJsonRpcResult(id, signedData);

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      const sendTransaction = request.params[0];
      const res = await client.sendUserOperation(
        erc4337Wallet.execute(
          sendTransaction.to,
          sendTransaction.value || 0,
          sendTransaction.data
        )
      );
      const ev = await res.wait();
      const hash = ev?.transactionHash;
      return formatJsonRpcResult(id, hash);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0];
      const signature = await signer.signTransaction(signTransaction);
      return formatJsonRpcResult(id, signature);

    default:
      throw new Error(getSdkError('INVALID_METHOD').message);
  }
}

export function rejectEIP155Request(
  request: SignClientTypes.EventArguments['session_request']
) {
  return formatJsonRpcError(
    request.id,
    getSdkError('USER_REJECTED_METHODS').message
  );
}
