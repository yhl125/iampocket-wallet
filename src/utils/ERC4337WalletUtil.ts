import { getZeroDevSigner } from '@zerodevapp/sdk';
import { SupportedGasToken } from '@zerodevapp/sdk/dist/src/types';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { AuthSig } from '@lit-protocol/types';
import { projectIdOf } from './ProviderUtil';
import AddressStore from '@/store/AddressStore';

/**
 * Utilities
 */
export async function createOrRestoreERC4337Wallet(
  pkpPubKey: string,
  authSig: AuthSig
) {
  const signer = await getERC4337Signer(pkpPubKey, authSig);
  const address = await signer.getAddress();
  AddressStore.setERC4337Address(address);

  return address;
}

export async function getERC4337Signer(pkpPubKey: string, authSig: AuthSig, chainId: number = 80001) {
  return getZeroDevSigner({
    projectId: projectIdOf(chainId),
    owner: new PKPEthersWallet({
      pkpPubKey: pkpPubKey,
      controllerAuthSig: authSig,
    }),
  });
}

export async function getERC4337SignerWithERC20Gas(
  gasToken: SupportedGasToken,
  pkpPubKey: string,
  authSig: AuthSig,
  chainId: number = 80001
) {
  return getZeroDevSigner({
    projectId: projectIdOf(chainId),
    owner: new PKPEthersWallet({
      pkpPubKey: pkpPubKey,
      controllerAuthSig: authSig,
    }),
    gasToken: gasToken,
  });
}
