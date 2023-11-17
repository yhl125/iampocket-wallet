import { useEffect } from 'react';
import { Client } from '@web3mq/client';
import {
  Chat,
  DashBoard,
  ConnectMessage,
} from '@web3mq/react-components';

import useLoginStorage from '@/hooks/chat/useLoginStorage';
import Login from './Login';
import Main from './Main';

export default function ChatMain() {
  const { keys, fastestUrl, initClient, logout, handleLoginEvent } =
    useLoginStorage();

  useEffect(() => {
    initClient();
  }, [initClient]);

  if (!keys) {
    let mainKeys = null;
    const mainPrivateKey = localStorage.getItem(`Web3MQ-Main-PrivateKey`);
    const mainPublicKey = localStorage.getItem(`Web3MQ-Main-PublicKey`);
    const address = localStorage.getItem('Web3MQ-WalletAddress');
    if (mainPublicKey && mainPrivateKey && address) {
      mainKeys = {
        publicKey: mainPublicKey,
        privateKey: mainPrivateKey,
        walletAddress: address,
      };
    }
    return (
      <Login
        handleLoginEvent={handleLoginEvent}
        keys={mainKeys}
        fastUrl={fastestUrl}
      />
    );
  }

  if (!fastestUrl) {
    return null;
  }

  const client = Client.getInstance(keys);

  return (
    <Chat client={client} logout={logout}>
      <ConnectMessage />
      <DashBoard />
      <Main />
    </Chat>
  );
}
