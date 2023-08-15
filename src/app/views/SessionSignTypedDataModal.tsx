import ProjectInfoCard from '@/components/walletconnect-modal/ProjectInfoCard';
import RequestDataCard from '@/components/walletconnect-modal/RequestDataCard';
import RequesDetailsCard from '@/components/walletconnect-modal/RequestDetalilsCard';
import RequestMethodCard from '@/components/walletconnect-modal/RequestMethodCard';
import RequestModalContainer from '@/components/walletconnect-modal/RequestModalContainer';
import ModalStore from '@/store/ModalStore';
import PKPStore from '@/store/PKPStore';
import {
  approveEIP155Request,
  rejectEIP155Request,
} from '@/utils/EIP155RequestHandlerUtil';
import { getSignTypedDataParamsData } from '@/utils/HelperUtil';
import { web3wallet } from '@/utils/WalletConnectUtil';
import { useSnapshot } from 'valtio';

function SessionSignTypedDataModal() {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;
  const { currentPKP, authSig } = useSnapshot(PKPStore.state);

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <p>Missing request data</p>;
  }

  // Get required request data
  const { topic, params } = requestEvent;
  const { request, chainId } = params;

  // Get data
  const data = getSignTypedDataParamsData(request.params);

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (requestEvent) {
      const response = await approveEIP155Request(
        requestEvent,
        currentPKP!.publicKey,
        authSig!
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
      <RequestModalContainer title="Sign Typed Data">
        <ProjectInfoCard metadata={requestSession.peer.metadata} />

        <div className="my-2"></div>

        <RequesDetailsCard
          chains={[chainId ?? '']}
          protocol={requestSession.relay.protocol}
        />

        <div className="my-2"></div>

        <RequestDataCard data={data} />

        <div className="my-2"></div>

        <RequestMethodCard methods={[request.method]} />

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
export default SessionSignTypedDataModal;
