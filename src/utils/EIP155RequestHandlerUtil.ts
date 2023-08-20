import { EIP155_SIGNING_METHODS } from '@/data/EIP155Data';
import {
  getSignParamsMessage,
  getSignTypedDataParamsData,
} from '@/utils/HelperUtil';
import { SignClientTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
} from '@walletconnect/jsonrpc-utils';
import { getERC4337Signer } from './ERC4337WalletUtil';
import { SessionSigs } from '@lit-protocol/types';

export async function approveEIP155Request(
  requestEvent: SignClientTypes.EventArguments['session_request'],
  publicKey: string,
  sessionSigs: SessionSigs,
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const erc4337Wallet = await getERC4337Signer(publicKey, sessionSigs);

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      const message = getSignParamsMessage(request.params);
      const signedMessage = await erc4337Wallet.signMessage(message);
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
      const signedData = await erc4337Wallet._signTypedData(
        domain,
        types,
        data,
      );
      return formatJsonRpcResult(id, signedData);

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      const sendTransaction = request.params[0];
      // below expected gas of 33100
      sendTransaction.gasLimit = 33100;
      const res = await erc4337Wallet.sendTransaction(sendTransaction);
      const hash = res.hash;
      return formatJsonRpcResult(id, hash);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0];
      const signature = await erc4337Wallet.signTransaction(signTransaction);
      return formatJsonRpcResult(id, signature);

    default:
      throw new Error(getSdkError('INVALID_METHOD').message);
  }
}

export function rejectEIP155Request(
  request: SignClientTypes.EventArguments['session_request'],
) {
  return formatJsonRpcError(
    request.id,
    getSdkError('USER_REJECTED_METHODS').message,
  );
}
