import { SessionSigs } from '@lit-protocol/types';
import { selectedWalletType } from '@/store/AddressStore';
import { createPkpViemWalletClient } from './EOAWalletUtil';
import { zeroDevSigner } from './ERC4337WalletUtil';

export async function signMessage(
  message: string,
  publicKey: string,
  sessionSigs: SessionSigs,
  selectedWallet: selectedWalletType,
) {
  const eoaWallet = createPkpViemWalletClient(publicKey, sessionSigs, 1);

  const erc4337Wallet = await zeroDevSigner(publicKey, sessionSigs, 1);
  if (selectedWallet === 'zeroDev') {
    return await erc4337Wallet.signMessageWith6492(message);
  } else if (selectedWallet === 'pkpViem') {
    return await eoaWallet.signMessage({
      message,
      account: eoaWallet.account!,
    });
  } else {
    throw new Error('selectedWallet is not supported');
  }
}
