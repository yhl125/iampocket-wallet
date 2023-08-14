import ProjectInfoCard from '@/components/walletconnect-modal/ProjectInfoCard';
import RequesDetailsCard from '@/components/walletconnect-modal/RequestDetalilsCard';
import RequestMethodCard from '@/components/walletconnect-modal/RequestMethodCard';
import RequestModalContainer from '@/components/walletconnect-modal/RequestModalContainer';
import ModalStore from '@/store/ModalStore';

const SessionUnsuportedMethodModal = () => {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <p>Missing request data</p>;
  }

  // Get required request data
  const { topic, params } = requestEvent;
  const { chainId, request } = params;

  return (
    <>
      <RequestModalContainer title="Unsuported Method">
        <ProjectInfoCard metadata={requestSession.peer.metadata} />

        <div className="my-2"></div>

        <RequesDetailsCard
          chains={[chainId ?? '']}
          protocol={requestSession.relay.protocol}
        />

        <div className="my-2"></div>

        <RequestMethodCard methods={[request.method]} />
      </RequestModalContainer>

      <div className="modal-action">
        <button className="btn btn-error" onClick={ModalStore.close}>
          Close
        </button>
      </div>
    </>
  );
};
export default SessionUnsuportedMethodModal;
