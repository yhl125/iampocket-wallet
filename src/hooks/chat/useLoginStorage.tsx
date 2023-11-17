import { useMemo, useState } from 'react';
import { Client, EnvTypes, KeyPairsType } from '@web3mq/client';

const useLoginStorage = () => {
  const hasKeys = useMemo(() => {
    const PrivateKey = localStorage.getItem('Web3MQ-PrivateKey');
    const PublicKey = localStorage.getItem('Web3MQ-PublicKey');
    const userid = localStorage.getItem('Web3MQ-UserId');
    if (PrivateKey && PublicKey && userid) {
      return { PrivateKey, PublicKey, userid };
    }
    return null;
  }, []);

  const [keys, setKeys] = useState<KeyPairsType | null>(hasKeys);
  const [fastestUrl, setFastUrl] = useState<string | null>(null);

  const getEnv = (): EnvTypes => {
    if (process.env.NODE_ENV === 'development') {
      return 'dev';
    } else {
      return 'test';
    }
  };

  const initClient = async () => {
    const tempPubkey = localStorage.getItem('Web3MQ-PublicKey') || undefined;
    const didKey = localStorage.getItem('Web3MQ-DID-key') || undefined;
    const fastUrl = await Client.init({
      connectUrl: sessionStorage.getItem('Web3MQ-FastUrl'),
      app_key: 'app_key',
      didKey,
      tempPubkey,
      env: getEnv(),
    });
    sessionStorage.setItem('Web3MQ-FastUrl', fastUrl);
    setFastUrl(fastUrl);
  };

  const logout = () => {
    localStorage.removeItem('Web3MQ-PrivateKey');
    localStorage.removeItem('Web3MQ-PublicKey');
    localStorage.removeItem('Web3MQ-DID-key');
    localStorage.removeItem('Web3MQ-UserId');
    setKeys(null);
  };

  const handleLoginEvent = (eventData: any) => {
    if (eventData.data) {
      if (eventData.type === 'login') {
        const {
          privateKey,
          publicKey,
          tempPrivateKey,
          tempPublicKey,
          didKey,
          userid,
          address,
          pubkeyExpiredTimestamp,
        } = eventData.data;
        localStorage.setItem('Web3MQ-UserId', userid);
        localStorage.setItem('Web3MQ-PrivateKey', tempPrivateKey);
        localStorage.setItem('Web3MQ-PublicKey', tempPublicKey);
        localStorage.setItem('Web3MQ-WalletAddress', address);
        localStorage.setItem(`Web3MQ-Main-PrivateKey`, privateKey);
        localStorage.setItem(`Web3MQ-Main-PublicKey`, publicKey);
        localStorage.setItem(`Web3MQ-DID-key`, didKey);
        localStorage.setItem(
          'Web3MQ-PUBKEY_EXPIRED_TIMESTAMP',
          String(pubkeyExpiredTimestamp),
        );
        setKeys({
          PrivateKey: tempPrivateKey,
          PublicKey: tempPublicKey,
          userid,
        });
      }
      if (eventData.type === 'register') {
        const { privateKey, publicKey, address } = eventData.data;
        localStorage.setItem('Web3MQ-WalletAddress', address);
        localStorage.setItem(`Web3MQ-Main-PrivateKey`, privateKey);
        localStorage.setItem(`Web3MQ-Main-PublicKey`, publicKey);
      }
    }
  };

  return {
    keys,
    fastestUrl,
    initClient,
    handleLoginEvent,
    logout,
  };
};

export default useLoginStorage;
