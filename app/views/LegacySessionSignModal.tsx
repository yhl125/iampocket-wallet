import ProjectInfoCard from '@/components/ProjectInfoCard';
import RequesDetailsCard from '@/components/RequestDetalilsCard';
import RequestMethodCard from '@/components/RequestMethodCard';
import RequestModalContainer from '@/components/RequestModalContainer';
import ModalStore from '@/store/ModalStore';
import {
  approveERC4337Request,
  rejectERC4337Request,
} from '@/utils/ERC4337RequestHandlerUtil';
import { getSignParamsMessage } from '@/utils/HelperUtil';
import { legacySignClient } from '@/utils/LegacyWalletConnectUtil';

export default function LegacySessionSignModal() {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.legacyCallRequestEvent;
  const requestSession = ModalStore.state.data?.legacyRequestSession;

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
      const { result } = await approveERC4337Request({
        id,
        topic: '',
        params: { request: { method, params }, chainId: '5' },
      });

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
      const { error } = rejectERC4337Request({
        id,
        topic: '',
        params: { request: { method, params }, chainId: '5' },
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
          <button className="btn-error btn" onClick={onReject}>
            Reject
          </button>
          <button className="btn-success btn" onClick={onApprove}>
            Approve
          </button>
        </div>
      </RequestModalContainer>
    </>
  );
}
