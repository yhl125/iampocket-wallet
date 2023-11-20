import { useRef, useState } from 'react';
import type { WalletType, BlockChainType } from '@web3mq/client';
import AddressStore from '@/store/AddressStore';
import { signMessage } from '@/utils/SignMessage';
import { useSnapshot } from 'valtio';
import PKPStore from '@/store/PKPStore';

export type LoginEventType = 'login' | 'register' | 'error';
export type LoginEventDataType = {
  type: LoginEventType;
  msg: string;
  data: LoginResType | RegisterResType | null;
};

export type MainKeysType = {
  publicKey: string;
  privateKey: string;
  walletAddress: string;
};

export type UserAccountType = {
  userid: string;
  address: string;
  walletType: WalletType;
  userExist: boolean;
};

export type LoginResType = {
  privateKey: string;
  publicKey: string;
  tempPrivateKey: string;
  tempPublicKey: string;
  didKey: `${BlockChainType}:${string}`;
  userid: string;
  address: string;
  walletType: WalletType;
  pubkeyExpiredTimestamp: number;
};
export type RegisterResType = {
  privateKey: string;
  publicKey: string;
  address: string;
  walletType: WalletType;
};

type IProps = {
  client: any;
  handleLoginEvent: (eventData: LoginEventDataType) => void;
  keys?: MainKeysType;
  account?: UserAccountType;
  isResetPassword?: boolean;
};

const useLogin = (props: IProps) => {
  const {
    client,
    handleLoginEvent,
    keys,
    account,
    isResetPassword = false,
  } = props;
  const [userAccount, setUserAccount] = useState<UserAccountType | undefined>(
    account,
  );
  const confirmPassword = useRef<string>('');
  const walletAddress = useRef<string>('');
  const [mainKeys, setMainKeys] = useState<MainKeysType | undefined>(keys);
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  // const { selectedWallet } = useSnapshot(AddressStore.state);
  // Web3MQ is not working with smart contract wallet
  const selectedWallet = 'pkpViem';

  const getMainKeypair = async (options: {
    password: string;
    did_value: string;
    did_type: string;
  }) => {
    const { password, did_value, did_type } = options;
    const { signContent } = await client.register.getMainKeypairSignContent({
      password,
      did_value,
      did_type,
    });
    const signature = await signMessage(
      signContent,
      currentPKP!.publicKey,
      sessionSigs!,
      selectedWallet,
    );
    const { publicKey, secretKey } =
      await client.register.getMainKeypairBySignature(
        signature,
        confirmPassword.current,
      );
    return { publicKey, secretKey };
  };

  const getRegisterSignContent = async (options: {
    userid: string;
    mainPublicKey: string;
    didType: string;
    didValue: string;
  }) => {
    const { userid, mainPublicKey, didValue, didType } = options;
    const { signContent } = await client.register.getRegisterSignContent({
      userid,
      mainPublicKey,
      didType,
      didValue,
    });
    const signature = await signMessage(
      signContent,
      currentPKP!.publicKey,
      sessionSigs!,
      selectedWallet,
    );
    return {
      signature,
    };
  };

  const register = async (nickname?: string): Promise<void> => {
    if (!userAccount) {
      return;
    }
    const { address, userid, walletType } = userAccount;
    const { publicKey, secretKey } = await getMainKeypair({
      password: confirmPassword.current,
      did_value: address,
      did_type: walletType,
    });
    const { signature } = await getRegisterSignContent({
      userid,
      mainPublicKey: publicKey,
      didType: walletType,
      didValue: address,
    });
    await commonRegister({
      mainPublicKey: publicKey,
      mainPrivateKey: secretKey,
      userid,
      didType: walletType,
      didValue: address,
      signature,
      nickname,
    });
  };

  const login = async () => {
    if (!userAccount) {
      return;
    }
    const { address, userid, walletType } = userAccount;
    let localMainPrivateKey = '';
    let localMainPublicKey = '';
    if (
      mainKeys &&
      address.toLowerCase() === mainKeys.walletAddress.toLowerCase()
    ) {
      localMainPrivateKey = mainKeys.privateKey;
      localMainPublicKey = mainKeys.publicKey;
    }
    if (!localMainPublicKey || !localMainPrivateKey) {
      const { publicKey, secretKey } = await getMainKeypair({
        password: confirmPassword.current,
        did_value: address,
        did_type: walletType,
      });
      localMainPrivateKey = secretKey;
      localMainPublicKey = publicKey;
    }

    await commonLogin({
      mainPrivateKey: localMainPrivateKey,
      mainPublicKey: localMainPublicKey,
      userid,
      didType: walletType,
      didValue: address,
    });
  };

  const getUserAccount = async (
    didType: WalletType = 'metamask',
    address?: string,
  ): Promise<{
    address: string;
    userExist: boolean;
  }> => {
    let didValue = address;
    if (!didValue) {
      const { address } = await client.register.getAccount(didType);
      didValue = address;
    }
    const { userid, userExist } = await client.register.getUserInfo({
      did_value: didValue,
      did_type: 'eth',
    });
    walletAddress.current = didValue as string;
    setUserAccount({
      userid,
      address: didValue as string,
      walletType: didType,
      userExist,
    });
    return {
      address: didValue as string,
      userExist,
    };
  };

  const commonLogin = async (options: {
    mainPublicKey: string;
    mainPrivateKey: string;
    userid: string;
    didType: WalletType;
    didValue: string;
  }) => {
    const { didType, didValue, userid } = options;

    const {
      tempPrivateKey,
      tempPublicKey,
      pubkeyExpiredTimestamp,
      mainPrivateKey,
      mainPublicKey,
    } = await client.register.login({
      ...options,
      password: confirmPassword.current,
    });

    handleLoginEvent({
      msg: '',
      type: 'login',
      data: {
        privateKey: mainPrivateKey,
        publicKey: mainPublicKey,
        tempPrivateKey,
        tempPublicKey,
        didKey: `eth:${didValue}`,
        userid: userid,
        address: didValue,
        pubkeyExpiredTimestamp,
        walletType: didType,
      },
    });
  };

  const commonRegister = async (options: {
    mainPublicKey: string;
    mainPrivateKey: string;
    userid: string;
    didType: WalletType;
    didValue: string;
    signature: string;
    didPubkey?: string;
    nickname?: string;
  }) => {
    const {
      userid,
      mainPublicKey,
      mainPrivateKey,
      signature,
      didValue,
      didType,
      didPubkey = '',
      nickname = '',
    } = options;
    const params = {
      userid,
      didValue,
      mainPublicKey,
      did_pubkey: didPubkey,
      didType,
      nickname,
      avatar_url: `https://cdn.stamp.fyi/avatar/${didValue}?s=300`,
      signature,
    };
    if (isResetPassword) {
      await client.register.resetPassword(params);
    } else {
      await client.register.register(params);
    }

    handleLoginEvent({
      msg: '',
      type: 'register',
      data: {
        privateKey: mainPrivateKey,
        publicKey: mainPublicKey,
        address: didValue,
        walletType: didType,
      },
    });
    await commonLogin({
      mainPrivateKey,
      mainPublicKey,
      didType,
      didValue,
      userid,
    });
  };

  return {
    mainKeys,
    getUserAccount,
    userAccount,
    setMainKeys,
    setUserAccount,
    confirmPassword,
    login,
    register,
  };
};

export default useLogin;
