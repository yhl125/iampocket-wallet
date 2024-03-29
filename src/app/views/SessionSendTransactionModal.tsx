import { LoadingSmall } from '@/components/Loading';
import ProjectInfoCard from '@/components/walletconnect-modal/ProjectInfoCard';
import RequestDataCard from '@/components/walletconnect-modal/RequestDataCard';
import RequesDetailsCard from '@/components/walletconnect-modal/RequestDetalilsCard';
import RequestMethodCard from '@/components/walletconnect-modal/RequestMethodCard';
import RequestModalContainer from '@/components/walletconnect-modal/RequestModalContainer';
import ModalStore from '@/store/ModalStore';
import PKPStore from '@/store/PKPStore';
import {
  approveEIP155RequestZeroDev,
  rejectEIP155Request,
} from '@/utils/EIP155RequestHandlerUtil';
import { web3wallet } from '@/utils/WalletConnectUtil';
// import { Button, Divider, Loading, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';
import { useSnapshot } from 'valtio';

function SessionSendTransactionModal() {
  const [loading, setLoading] = useState(false);

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);

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
      const response = await approveEIP155RequestZeroDev(
        requestEvent,
        currentPKP!.publicKey,
        sessionSigs!,
      );
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
            className="btn btn-error"
            onClick={onReject}
            disabled={loading}
          >
            Reject
          </button>
          <button
            className="btn btn-success"
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
export default SessionSendTransactionModal;
