import {
  convertEthersSignerToAccountSigner,
  ZeroDevEthersProvider,
} from '@zerodev/sdk';
import { SupportedGasToken } from '@zerodev/sdk/dist/types';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { SessionSigs } from '@lit-protocol/types';
import { projectIdOf } from './ProviderUtil';
import AddressStore from '@/store/AddressStore';
import {
  BiconomySmartAccount,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account';
import { Bundler } from '@biconomy/bundler';
import { BiconomyPaymaster } from '@biconomy/paymaster';
import { biconomyPaymasterOf } from './biconomyUtil';
import { EIP155_CHAINS } from '@/data/EIP155Data';

/**
 * Utilities
 */
export async function createOrRestoreERC4337Wallet(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
) {
  const [zeroDevWallet, biconomyWallet, eoaPkpEthersWallet] = await Promise.all(
    [
      zeroDevSigner(pkpPubKey, sessionSigs),
      biconomySmartAccount(pkpPubKey, sessionSigs),
      pkpEthersWalletSigner(pkpPubKey, sessionSigs),
    ],
  );
  const [zeroDevAddress, biconomyAddress, eoaPkpEthersAddress] =
    await Promise.all([
      zeroDevWallet.getAddress(),
      biconomyWallet.getSmartAccountAddress(),
      eoaPkpEthersWallet.getAddress(),
    ]);
  AddressStore.setZeroDevAddress(zeroDevAddress);
  AddressStore.setBiconomyAddress(biconomyAddress);
  AddressStore.setPkpEthersAddress(eoaPkpEthersAddress);

  return zeroDevAddress;
}

export async function pkpEthersWalletSigner(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number = 80001,
) {
  const rpcUrl = EIP155_CHAINS[`eip155:${chainId}`].rpc;

  const pkpEthersWalletSigner: PKPEthersWallet = new PKPEthersWallet({
    pkpPubKey: pkpPubKey,
    controllerSessionSigs: sessionSigs,
    rpc: rpcUrl,
  });
  return pkpEthersWalletSigner;
}

export async function zeroDevSigner(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number = 80001,
) {
  const owner = new PKPEthersWallet({
    pkpPubKey: pkpPubKey,
    controllerSessionSigs: sessionSigs,
  });
  const provider = await ZeroDevEthersProvider.init('ECDSA', {
    projectId: projectIdOf(chainId),
    owner: convertEthersSignerToAccountSigner(owner),
  });
  return provider.getAccountSigner();
}

export async function zeroDevSignerWithERC20Gas(
  gasToken: SupportedGasToken,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number = 80001,
) {
  const owner = new PKPEthersWallet({
    pkpPubKey: pkpPubKey,
    controllerSessionSigs: sessionSigs,
  });
  const providerWithERC20Gas = await ZeroDevEthersProvider.init('ECDSA', {
    projectId: projectIdOf(chainId),
    owner: convertEthersSignerToAccountSigner(owner),
    opts: {
      paymasterConfig: {
        policy: 'TOKEN_PAYMASTER',
        gasToken: gasToken,
      },
    },
  });

  return providerWithERC20Gas.getAccountSigner();
}

export async function biconomySmartAccount(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number = 59140,
) {
  // create bundler and paymaster instances
  const bundler = new Bundler({
    bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
    chainId: chainId,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });
  const paymaster = new BiconomyPaymaster({
    paymasterUrl: biconomyPaymasterOf(chainId),
    strictMode: false, // by default is true. If set to false, then paymaster and data is still sent as 0x and account will pay in native
  });
  const rpcUrl = EIP155_CHAINS[`eip155:${chainId}`].rpc;
  if (!rpcUrl) {
    throw new Error(`No RPC endpoint for chainId ${chainId}`);
  }
  // create biconomy smart account instance
  const biconomySmartAccountConfig = {
    signer: new PKPEthersWallet({
      pkpPubKey: pkpPubKey,
      controllerSessionSigs: sessionSigs,
    }),
    chainId: chainId,
    rpcUrl: rpcUrl,
    paymaster: paymaster, // optional
    bundler: bundler, // optional
    // nodeClientUrl: config.nodeClientUrl, // if needed to override
  };
  const biconomyAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
  return await biconomyAccount.init({ accountIndex: 0 });
}
