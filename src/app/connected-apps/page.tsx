'use client';

import ConnectedAppStore from '@/store/ConnectedAppStore';
import { createWeb3Wallet, web3wallet } from '@/utils/WalletConnectUtil';
import { useSnapshot } from 'valtio';
import ConnectedAppCard from '@/components/connected-apps/ConnectedAppCard';
import { useEffect, useState } from 'react';

function ConnectedAppsPage() {
  const { connectedApps } = useSnapshot(ConnectedAppStore.state);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    createWeb3Wallet();
  },[]);

  useEffect(() => {
    setMounted(true);
  }, []);

  function wcDisconnect(topic: string) {
    ConnectedAppStore.disconnectApp(topic);
    return web3wallet.disconnectSession({
      topic,
      reason: { code: 0, message: 'User disconnected' },
    });
  }

  return (
    mounted && (
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
    )
  );
}

export default ConnectedAppsPage;
