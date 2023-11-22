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
import { createPkpViemWalletClient } from './EOAWalletUtil';
import AddressStore from '@/store/AddressStore';

export async function approveEIP155RequestZeroDev(
  requestEvent: SignClientTypes.EventArguments['session_request'],
  publicKey: string,
  sessionSigs: SessionSigs,
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const eoaWallet = createPkpViemWalletClient(
    publicKey,
    sessionSigs,
    EIP155_CHAINS[chainId].chainId,
  );

  const erc4337Wallet = await zeroDevSigner(
    publicKey,
    sessionSigs,
    EIP155_CHAINS[chainId].chainId,
  );

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      const message = getSignParamsMessage(request.params);
      if (AddressStore.state.selectedWallet === 'zeroDev') {
        const signedMessage = await erc4337Wallet.signMessage(message);
        return formatJsonRpcResult(id, signedMessage);
      } else if (AddressStore.state.selectedWallet === 'pkpViem') {
        const signedMessage = await eoaWallet.signMessage({
          message: message,
          account: eoaWallet.account!,
        });
        return formatJsonRpcResult(id, signedMessage);
      }

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      const {
        domain,
        types,
        message: data,
        primaryType,
      } = getSignTypedDataParamsData(request.params);
      // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
      delete types.EIP712Domain;
      if (AddressStore.state.selectedWallet === 'zeroDev') {
        const signedData = await erc4337Wallet.signTypedDataWith6492({
          domain,
          types,
          message: data,
          primaryType: primaryType,
        });
        return formatJsonRpcResult(id, signedData);
      } else if (AddressStore.state.selectedWallet === 'pkpViem') {
        const signedData = await eoaWallet.signTypedData({
          domain,
          types,
          message: data,
          primaryType: primaryType,
          account: eoaWallet.account!,
        });
        return formatJsonRpcResult(id, signedData);
      }

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      const sendTransaction = request.params[0];
      // below expected gas of 33100
      sendTransaction.gasLimit = 33100;
      if (AddressStore.state.selectedWallet === 'zeroDev') {
        // ECDSA Provider Does not have signTransaction so use keccak256 to turn transaction to Uint8Array and sign it with signMessage
        const hash = await erc4337Wallet.sendTransaction(sendTransaction);
        return formatJsonRpcResult(id, hash);
      } else if (AddressStore.state.selectedWallet === 'pkpViem') {
        const hash = await eoaWallet.sendTransaction(sendTransaction);
        return formatJsonRpcResult(id, hash);
      }

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0];
      if (AddressStore.state.selectedWallet === 'zeroDev') {
        // ECDSA Provider Does not have signTransaction so use keccak256 to turn transaction to Uint8Array and sign it with signMessage
        const signature = await erc4337Wallet.signMessageWith6492(
          keccak256(serializeTransaction(signTransaction)),
        );
        return formatJsonRpcResult(id, signature);
      } else if (AddressStore.state.selectedWallet === 'pkpViem') {
        const signature = await eoaWallet.signTransaction(signTransaction);
        return formatJsonRpcResult(id, signature);
      }

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
