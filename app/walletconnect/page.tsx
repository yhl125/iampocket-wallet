'use client';

import { LoadingSmall } from '@/components/Loading';
import Modal from '@/components/Modal';
import QrReader from '@/components/QrReader';
import useAccounts from '@/hooks/useAccounts';
import useWalletConnectEventsManager from '@/hooks/useWalletConnectEventsManager';
import { createWeb3Wallet, web3wallet } from '@/utils/WalletConnectUtil';
import { Fragment, SetStateAction, useEffect, useState } from 'react';

export default function WalletConnectPage() {
  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);

  async function onConnect(uri: string) {
    try {
      setLoading(true);
      await web3wallet.pair({ uri });
    } catch (err: unknown) {
      alert(err);
    } finally {
      setUri('');
      setLoading(false);
    }
  }

  useEffect(() => {
    createWeb3Wallet();
  });

  // Step 2 - Initialize wallets
  useAccounts();

  // Step 3 - Once initialized, set up wallet connect event manager
  useWalletConnectEventsManager();

  return (
    <Fragment>
      <QrReader onConnect={onConnect} />
      <p className="my-40 text-center text-sm text-gray-900 dark:text-white">
        or use walletconnect uri
      </p>
      <div className="form-control">
        <div className="input-group">
          <input
            type="text"
            aria-label="wc url connect input"
            placeholder="e.g. wc:a281567bb3e4..."
            className="input-bordered input w-full max-w-xs"
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setUri(e.target.value)
            }
            value={uri}
          />
          <button
            className="btn"
            disabled={!uri}
            onClick={() => onConnect(uri)}
          >
            {loading ? <LoadingSmall /> : 'Connect'}
          </button>
        </div>
      </div>
      <Modal />
    </Fragment>
  );
}
