import { EIP155_CHAINS, EIP155_SIGNING_METHODS } from '@/data/EIP155Data';
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
import { zeroDevSigner } from './ERC4337WalletUtil';
import { SessionSigs } from '@lit-protocol/types';
import { keccak256 } from 'viem';
import { serializeTransaction } from 'viem';

export async function approveEIP155RequestZeroDev(
  requestEvent: SignClientTypes.EventArguments['session_request'],
  publicKey: string,
  sessionSigs: SessionSigs,
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const erc4337Wallet = await zeroDevSigner(
    publicKey,
    sessionSigs,
    EIP155_CHAINS[chainId].chainId,
  );

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      const message = getSignParamsMessage(request.params);
      const signedMessage = await erc4337Wallet.signMessageWith6492(message);
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
      const signedData = await erc4337Wallet.signTypedDataWith6492({
        domain,
        types,
        message: data,
        primaryType: 'EIP712Domain',
      });
      return formatJsonRpcResult(id, signedData);

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      const sendTransaction = request.params[0];
      // below expected gas of 33100
      sendTransaction.gasLimit = 33100;
      const result = await erc4337Wallet.sendTransaction(sendTransaction);
      const hash = result;
      return formatJsonRpcResult(id, hash);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0];
      // ECDSA Provider Does not have signTransaction so use keccak256 to turn transaction to Uint8Array and sign it with signMessage
      const signature = await erc4337Wallet.signMessageWith6492(
        keccak256(serializeTransaction(signTransaction)),
      );
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
