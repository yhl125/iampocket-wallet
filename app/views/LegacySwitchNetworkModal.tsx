import RequestModalContainer from '@/components/RequestModalContainer';
import ModalStore from '@/store/ModalStore';
import { legacySignClient } from '@/utils/LegacyWalletConnectUtil';

export default function LegacySwitchNetworkModal() {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.legacyCallRequestEvent;
  const requestSession = ModalStore.state.data?.legacyRequestSession;

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <p>Missing request data</p>;
  }

  // Get required request data
  const { params } = requestEvent;

  // Get message, convert it to UTF8 string if it is valid hex
  const message = `change network to ${params[0].chainId}`;

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (requestEvent) {

      legacySignClient.updateSession({
        accounts: requestSession?.accounts!,
        chainId: parseInt(params[0].chainId),
      })

      ModalStore.close();
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      ModalStore.close();
    }
  }

  return (
    <>
      <RequestModalContainer title="Switch Network">

        <div className="my-2"></div>

        <div>
          <h5>Message</h5>
          <p>{message}</p>
        </div>

        <div className="my-2"></div>


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
