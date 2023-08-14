'use client';

import ModalStore from '@/store/ModalStore';
import SessionProposalModal from '@/app/views/SessionProposalModal';
import SessionSendTransactionModal from '@/app/views/SessionSendTransactionModal';
import SessionSignModal from '@/app/views/SessionSignModal';
import SessionSignTypedDataModal from '@/app/views/SessionSignTypedDataModal';
import SessionUnsuportedMethodModal from '@/app/views/SessionUnsuportedMethodModal';
import { useSnapshot } from 'valtio';
import { useEffect } from 'react';
import { createWeb3Wallet } from '@/utils/WalletConnectUtil';
import useWalletConnectEventsManager from '@/hooks/useWalletConnectEventsManager';
import SettingsStore from '@/store/SettingsStore';

const Modal = () => {
  const { open, view } = useSnapshot(ModalStore.state);
  const { web3WalletReady } = useSnapshot(SettingsStore.state);
  useEffect(() => {
    if (web3WalletReady === false) createWeb3Wallet();
  }, []);

  useWalletConnectEventsManager();

  return (
    <>
      <input
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
        checked={open}
        readOnly
      />
      <div className="modal">
        {view === 'SessionProposalModal' && <SessionProposalModal />}
        {view === 'SessionSignModal' && <SessionSignModal />}
        {view === 'SessionSignTypedDataModal' && <SessionSignTypedDataModal />}
        {view === 'SessionSendTransactionModal' && (
          <SessionSendTransactionModal />
        )}
        {view === 'SessionUnsuportedMethodModal' && (
          <SessionUnsuportedMethodModal />
        )}
      </div>
    </>
  );
};
export default Modal;
