'use client';

import { LoadingSmall } from '@/components/Loading';
import Modal from '@/components/walletconnect-modal/Modal';
import useAccounts from '@/hooks/useAccounts';
import { web3wallet } from '@/utils/WalletConnectUtil';
import { SetStateAction, useState } from 'react';
import { parseUri } from '@walletconnect/utils';
import { createLegacySignClient } from '@/utils/LegacyWalletConnectUtil';
import QrHandler from '@/components/walletconnect/QrHandler';

const WalletConnectPage = () => {
  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);

  async function onConnect(uri: string) {
    try {
      setLoading(true);
      const { version } = parseUri(uri);

      // Route the provided URI to the v1 SignClient if URI version indicates it, else use v2.
      if (version === 1) {
        createLegacySignClient({ uri });
      } else {
        await web3wallet.pair({ uri });
      }
    } catch (err: unknown) {
      alert(err);
    } finally {
      setUri('');
      setLoading(false);
    }
  }

  useAccounts();

  return (
    <>
      <div className="walletconnect m-4">
        <QrHandler onConnect={onConnect} />
        <p className="my-4 text-center text-sm">or use walletconnect uri</p>
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              aria-label="wc url connect input"
              placeholder="e.g. wc:a281567bb3e4..."
              className="input input-bordered w-full max-w-xs"
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
      </div>
      <Modal />
    </>
  );
};
export default WalletConnectPage;
