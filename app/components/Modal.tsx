import ModalStore from '@/store/ModalStore';
import SessionProposalModal from '@/views/SessionProposalModal';
// import SessionSendTransactionModal from '@/views/SessionSendTransactionModal';
// import SessionRequestModal from '@/views/SessionSignModal';
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
        {/* {view === 'SessionSignModal' && <SessionRequestModal />}
        {view === 'SessionSignTypedDataModal' && <SessionSignTypedDataModal />}
        {view === 'SessionSendTransactionModal' && (
          <SessionSendTransactionModal />
        )}
        {view === 'SessionUnsuportedMethodModal' && (
          <SessionUnsuportedMethodModal />
        )} */}
      </div>
    </>
  );
}
