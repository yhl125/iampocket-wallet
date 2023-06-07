import { LoadingSmall } from '@/components/Loading';
import ProjectInfoCard from '@/components/ProjectInfoCard';
import RequestDataCard from '@/components/RequestDataCard';
import RequesDetailsCard from '@/components/RequestDetalilsCard';
import RequestMethodCard from '@/components/RequestMethodCard';
import RequestModalContainer from '@/components/RequestModalContainer';
import ModalStore from '@/store/ModalStore';
import PKPStore from '@/store/PKPStore';
import {
  approveEIP155Request,
  rejectEIP155Request,
} from '@/utils/EIP155RequestHandlerUtil';
import { legacySignClient } from '@/utils/LegacyWalletConnectUtil';
import { useState } from 'react';
import { useSnapshot } from 'valtio';

export default function LegacySessionSendTransactionModal() {
  const [loading, setLoading] = useState(false);
  const { currentPKP, authSig } = useSnapshot(PKPStore.state);

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.legacyCallRequestEvent;
  const requestSession = ModalStore.state.data?.legacyRequestSession;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <p>Missing request data</p>;
  }

  // Get required proposal data

  const { id, method, params } = requestEvent;
  const transaction = params[0];

  // // Remove unneeded key coming from v1 sample dapp that throws Ethers.
  if (transaction['gas']) delete transaction['gas'];

  // Handle approve action
  async function onApprove() {
    if (requestEvent) {
      const chainId = 'eip155:' + requestSession!.chainId.toString();
      const { result } = await approveEIP155Request(
        {
          id,
          topic: '',
          params: {
            request: { method, params },
            chainId: chainId,
          },
        },
        currentPKP!.publicKey,
        authSig!
      );

      legacySignClient.approveRequest({
        id,
        result,
      });
      console.log('result', result);
      ModalStore.close();
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      const { error } = rejectEIP155Request({
        id,
        topic: '',
        params: { request: { method, params }, chainId: '1' },
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
      <RequestModalContainer title="Send / Sign Transaction">
        <ProjectInfoCard metadata={requestSession.peerMeta!} />

        <div className="my-2"></div>

        <RequestDataCard data={transaction} />

        <div className="my-2"></div>

        <RequesDetailsCard
          chains={['eip155:' + legacySignClient.chainId]}
          protocol={legacySignClient.protocol}
        />

        <div className="my-2"></div>

        <RequestMethodCard methods={[method]} />

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
