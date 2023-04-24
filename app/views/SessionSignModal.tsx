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
import { web3wallet } from '@/utils/WalletConnectUtil';
import { Fragment } from 'react';

export default function SessionSignModal() {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <p>Missing request data</p>;
  }

  // Get required request data
  const { topic, params } = requestEvent;
  const { request, chainId } = params;

  // Get message, convert it to UTF8 string if it is valid hex
  const message = getSignParamsMessage(request.params);

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (requestEvent) {
      const response = await approveERC4337Request(requestEvent);
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
      ModalStore.close();
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      const response = rejectERC4337Request(requestEvent);
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
      ModalStore.close();
    }
  }

  return (
    <Fragment>
      <RequestModalContainer title="Sign Message">
        <ProjectInfoCard metadata={requestSession.peer.metadata} />

        <div className="my-2"></div>

        <RequesDetailsCard
          chains={[chainId ?? '']}
          protocol={requestSession.relay.protocol}
        />

        <div className="my-2"></div>

        <div>
          <h5>Message</h5>
          <p>{message}</p>
        </div>

        <div className="my-2"></div>

        <RequestMethodCard methods={[request.method]} />
      </RequestModalContainer>

      <div className="modal-action">
        <button className="btn-error btn" onClick={onReject}>
          Reject
        </button>
        <button className="btn-success btn" onClick={onApprove}>
          Approve
        </button>
      </div>
    </Fragment>
  );
}
