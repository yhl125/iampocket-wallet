// import { EIP155_SIGNING_METHODS } from '@/data/EIP155Data'
import ModalStore from '@/store/ModalStore';
import SettingsStore from '@/store/SettingsStore';
import { SignClientTypes } from '@walletconnect/types';
import { useCallback, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { EIP155_SIGNING_METHODS } from '@/data/EIP155Data';
import { web3wallet } from '@/utils/WalletConnectUtil';
import ConnectedAppStore from '@/store/ConnectedAppStore';

function useWalletConnectEventsManager() {
  const { web3WalletReady } = useSnapshot(SettingsStore.state);

  /******************************************************************************
   * 1. Open session proposal modal for confirmation / rejection
   *****************************************************************************/
  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      ModalStore.open('SessionProposalModal', { proposal });
    },
    []
  );

  /******************************************************************************
   * 3. Open request handling modal based on method that was used
   *****************************************************************************/
  const onSessionRequest = useCallback(
    async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
      const { topic, params } = requestEvent;
      const { request } = params;
      const requestSession = web3wallet.getActiveSessions()[topic];

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          return ModalStore.open('SessionSignModal', {
            requestEvent,
            requestSession,
          });

        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
          return ModalStore.open('SessionSignTypedDataModal', {
            requestEvent,
            requestSession,
          });

        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
          return ModalStore.open('SessionSendTransactionModal', {
            requestEvent,
            requestSession,
          });

        default:
          return ModalStore.open('SessionUnsuportedMethodModal', {
            requestEvent,
            requestSession,
          });
      }
    },
    []
  );

  const onSessionDelete = useCallback(
    (data: SignClientTypes.EventArguments['session_delete']) => {
      ConnectedAppStore.disconnectApp(data.topic);
    },
    []
  );

  /******************************************************************************
   * Set up WalletConnect event listeners
   *****************************************************************************/
  useEffect(() => {
    if (web3WalletReady) {
      web3wallet.on('session_proposal', onSessionProposal);
      web3wallet.on('session_request', onSessionRequest);
      web3wallet.on('session_delete', onSessionDelete);
    }
  }, [web3WalletReady, onSessionProposal, onSessionRequest, onSessionDelete]);
};
export default useWalletConnectEventsManager;
