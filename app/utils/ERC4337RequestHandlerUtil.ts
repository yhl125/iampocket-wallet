import {
  EIP155_CHAINS,
  EIP155_SIGNING_METHODS,
  TEIP155Chain,
} from '@/data/EIP155Data';
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

export async function approveERC4337Request(
  requestEvent: SignClientTypes.EventArguments['session_request']
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const provider = new providers.JsonRpcProvider(config.rpcUrl);
  const owner = new Wallet(config.signingKey, provider);

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN: 
      const message = getSignParamsMessage(request.params);
      const signedMessage = await owner.signMessage(message);
      

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
      const signedData = await owner._signTypedData(domain, types, data);
      return formatJsonRpcResult(id, signedData);

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      const provider = new providers.JsonRpcProvider(
        EIP155_CHAINS[chainId as TEIP155Chain].rpc
      );
      const sendTransaction = request.params[0];
      const connectedWallet = owner.connect(provider);
      const { hash } = await connectedWallet.sendTransaction(sendTransaction);
      return formatJsonRpcResult(id, hash);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0];
      const signature = await owner.signTransaction(signTransaction);
      return formatJsonRpcResult(id, signature);

    default:
      throw new Error(getSdkError('INVALID_METHOD').message);
  }
}

export function rejectERC4337Request(
  request: SignClientTypes.EventArguments['session_request']
) {
  return formatJsonRpcError(request.id, getSdkError('USER_REJECTED_METHODS').message);
}
