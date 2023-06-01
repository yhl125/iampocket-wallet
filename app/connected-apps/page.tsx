'use client';

import ConnectedAppStore from '@/store/ConnectedAppStore';
import { createWeb3Wallet, web3wallet } from '@/utils/WalletConnectUtil';
import { useSnapshot } from 'valtio';
import ConnectedAppCard from '@/components/ConnectedAppCard';
import { useEffect } from 'react';

export default function ConnectedAppsPage() {
  const { connectedApps } = useSnapshot(ConnectedAppStore.state);

  useEffect(() => {
    createWeb3Wallet();
  });

  function wcDisconnect(topic: string) {
    ConnectedAppStore.disconnectApp(topic);
    return web3wallet.disconnectSession({
      topic,
      reason: { code: 0, message: 'User disconnected' },
    });
  }

  return (
    <>
      <div className="connectedApps m-4">
        {connectedApps.map((connectedApp) => (
          <ConnectedAppCard
            connectedApp={connectedApp}
            wcDisconnect={wcDisconnect}
            key={connectedApp.topic}
          />
        ))}
      </div>
    </>
  );
}
