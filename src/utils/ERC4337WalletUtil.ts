import { getZeroDevSigner } from '@zerodevapp/sdk';
import { SupportedGasToken } from '@zerodevapp/sdk/dist/src/types';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { SessionSigs } from '@lit-protocol/types';
import { projectIdOf } from './ProviderUtil';
import AddressStore from '@/store/AddressStore';

/**
 * Utilities
 */
export async function createOrRestoreERC4337Wallet(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
) {
  const signer = await getERC4337Signer(pkpPubKey, sessionSigs);
  const address = await signer.getAddress();
  AddressStore.setERC4337Address(address);

  return address;
}

export async function getERC4337Signer(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number = 80001,
) {
  return getZeroDevSigner({
    projectId: projectIdOf(chainId),
    owner: new PKPEthersWallet({
      pkpPubKey: pkpPubKey,
      controllerSessionSigs: sessionSigs,
    }),
  });
}

export async function getERC4337SignerWithERC20Gas(
  gasToken: SupportedGasToken,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number = 80001,
) {
  return getZeroDevSigner({
    projectId: projectIdOf(chainId),
    owner: new PKPEthersWallet({
      pkpPubKey: pkpPubKey,
      controllerSessionSigs: sessionSigs,
    }),
    gasToken: gasToken,
  });
}
