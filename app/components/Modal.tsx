import ModalStore from '@/store/ModalStore';
import LegacySessionProposalModal from '@/views/LegacySessionProposalModal';
import LegacySessionSignModal from '@/views/LegacySessionSignModal';
import LegacySwitchNetworkModal from '@/views/LegacySwitchNetworkModal';
import SessionProposalModal from '@/views/SessionProposalModal';
// import SessionSendTransactionModal from '@/views/SessionSendTransactionModal';
import SessionSignModal from '@/views/SessionSignModal';
// import SessionSignTypedDataModal from '@/views/SessionSignTypedDataModal';
// import SessionUnsuportedMethodModal from '@/views/SessionUnsuportedMethodModal';

import { useSnapshot } from 'valtio';

export default function Modal() {
  const { open, view } = useSnapshot(ModalStore.state);

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
        {/* {view === 'SessionSignTypedDataModal' && <SessionSignTypedDataModal />}
        {view === 'SessionSendTransactionModal' && (
          <SessionSendTransactionModal />
        )}
        {view === 'SessionUnsuportedMethodModal' && (
          <SessionUnsuportedMethodModal />
        )} */}
        {view === 'LegacySessionProposalModal' && (
          <LegacySessionProposalModal />
        )}
        {view === 'LegacySessionSignModal' && <LegacySessionSignModal />}
      {/* {view === 'LegacySessionSignTypedDataModal' && <LegacySessionSignTypedDataModal />}
      {view === 'LegacySessionSendTransactionModal' && <LegacySessionSendTransactionModal />} */}
      {view === 'LegacySwitchNetworkModal' && <LegacySwitchNetworkModal />}
      </div>
    </>
  );
}
