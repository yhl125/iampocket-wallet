import ProjectInfoCard from '@/components/walletconnect-modal/ProjectInfoCard';
import RequesDetailsCard from '@/components/walletconnect-modal/RequestDetalilsCard';
import RequestMethodCard from '@/components/walletconnect-modal/RequestMethodCard';
import RequestModalContainer from '@/components/walletconnect-modal/RequestModalContainer';
import ModalStore from '@/store/ModalStore';
import PKPStore from '@/store/PKPStore';
import {
  approveEIP155Request,
  rejectEIP155Request,
} from '@/utils/EIP155RequestHandlerUtil';
import { getSignParamsMessage } from '@/utils/HelperUtil';
import { legacySignClient } from '@/utils/LegacyWalletConnectUtil';
import { useSnapshot } from 'valtio';

const LegacySessionSignModal = () => {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.legacyCallRequestEvent;
  const requestSession = ModalStore.state.data?.legacyRequestSession;
  const { currentPKP, authSig } = useSnapshot(PKPStore.state);

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <p>Missing request data</p>;
  }

  // Get required request data
  const { id, method, params } = requestEvent;

  // Get message, convert it to UTF8 string if it is valid hex
  const message = getSignParamsMessage(params);

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (requestEvent) {
      const { result } = await approveEIP155Request(
        {
          id,
          topic: '',
          params: {
            request: { method, params },
            chainId: requestSession!.chainId.toString(),
          },
        },
        currentPKP!.publicKey,
        authSig!
      );

      legacySignClient.approveRequest({
        id,
        result,
      });
      ModalStore.close();
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      const { error } = rejectEIP155Request({
        id,
        topic: '',
        params: {
          request: { method, params },
          chainId: requestSession!.chainId.toString(),
        },
      });
      legacySignClient.rejectRequest({
        id,
        error,
      });
      ModalStore.close();
    }
  }

  return (
    <>
      <RequestModalContainer title="Sign Message">
        <ProjectInfoCard metadata={requestSession.peerMeta!} />

        <div className="my-2"></div>

        <RequesDetailsCard
          chains={['eip155:' + legacySignClient.chainId]}
          protocol={legacySignClient.protocol}
        />

        <div className="my-2"></div>

        <div>
          <h5>Message</h5>
          <p>{message}</p>
        </div>

        <div className="my-2"></div>

        <RequestMethodCard methods={[method]} />

        <div className="modal-action">
          <button className="btn btn-error" onClick={onReject}>
            Reject
          </button>
          <button className="btn btn-success" onClick={onApprove}>
            Approve
          </button>
        </div>
      </RequestModalContainer>
    </>
  );
};

export default LegacySessionSignModal;
