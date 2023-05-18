import { LoadingSmall } from '@/components/Loading';
import ProjectInfoCard from '@/components/ProjectInfoCard';
import RequestDataCard from '@/components/RequestDataCard';
import RequesDetailsCard from '@/components/RequestDetalilsCard';
import RequestMethodCard from '@/components/RequestMethodCard';
import RequestModalContainer from '@/components/RequestModalContainer';
import ModalStore from '@/store/ModalStore';
import {
  approveEIP155Request,
  rejectEIP155Request,
} from '@/utils/EIP155RequestHandlerUtil';
import { web3wallet } from '@/utils/WalletConnectUtil';
// import { Button, Divider, Loading, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';

export default function SessionSendTransactionModal() {
  const [loading, setLoading] = useState(false);

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <p>Missing request data</p>;
  }

  // Get required proposal data

  const { topic, params } = requestEvent;
  const { request, chainId } = params;
  const transaction = request.params[0];

  // Handle approve action
  async function onApprove() {
    if (requestEvent) {
      setLoading(true);
      const response = await approveEIP155Request(requestEvent);
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
      const response = rejectEIP155Request(requestEvent);
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
      ModalStore.close();
    }
  }

  return (
    <>
      <RequestModalContainer title="Send / Sign Transaction">
        <ProjectInfoCard metadata={requestSession.peer.metadata} />

        <div className="my-2"></div>

        <RequestDataCard data={transaction} />

        <div className="my-2"></div>

        <RequesDetailsCard
          chains={[chainId ?? '']}
          protocol={requestSession.relay.protocol}
        />

        <div className="my-2"></div>

        <RequestMethodCard methods={[request.method]} />

        <div className="modal-action">
          <button
            className="btn-error btn"
            onClick={onReject}
            disabled={loading}
          >
            Reject
          </button>
          <button
            className="btn-success btn"
            onClick={onApprove}
            disabled={loading}
          >
            {loading ? <LoadingSmall /> : 'Approve'}
          </button>
        </div>
      </RequestModalContainer>
    </>
  );
}