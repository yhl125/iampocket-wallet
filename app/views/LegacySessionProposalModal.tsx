import ProjectInfoCard from '@/components/ProjectInfoCard';
import ProposalSelectSection from '@/components/ProposalSelectSection';
import RequestModalContainer from '@/components/RequestModalContainer';
import ModalStore from '@/store/ModalStore';
import SettingsStore from '@/store/SettingsStore';
import { isEIP155Chain } from '@/utils/HelperUtil';
import { legacySignClient } from '@/utils/LegacyWalletConnectUtil';
import { getSdkError } from '@walletconnect/utils';
import { useState } from 'react';
import { useSnapshot } from 'valtio';

export default function LegacySessionProposalModal() {
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, string[]>
  >({});
  const hasSelected = Object.keys(selectedAccounts).length;
  const { erc4337Address } = useSnapshot(SettingsStore.state);

  // Get proposal data and wallet address from store
  const proposal = ModalStore.state.data?.legacyProposal;

  // Ensure proposal is defined
  if (!proposal) {
    return <p>Missing proposal data</p>;
  }

  // Get required proposal data
  const { id, params } = proposal;
  const [{ chainId, peerMeta }] = params;

  // Add / remove address from EIP155 selection
  function onSelectAccount(chain: string, account: string) {
    if (selectedAccounts[chain]?.includes(account)) {
      const newSelectedAccounts = selectedAccounts[chain]?.filter(
        (a) => a !== account
      );
      setSelectedAccounts((prev) => ({
        ...prev,
        [chain]: newSelectedAccounts,
      }));
    } else {
      const prevChainAddresses = selectedAccounts[chain] ?? [];
      setSelectedAccounts((prev) => ({
        ...prev,
        [chain]: [...prevChainAddresses, account],
      }));
    }
  }

  // Hanlde approve action, construct session namespace
  async function onApprove() {
    if (proposal) {
      legacySignClient.approveSession({
        accounts: selectedAccounts['eip155'],
        chainId: chainId ?? 1,
      });
    }
    ModalStore.close();
  }

  // Handle reject action
  function onReject() {
    if (proposal) {
      legacySignClient.rejectSession(getSdkError('USER_REJECTED_METHODS'));
    }
    ModalStore.close();
  }

  // Render account selection checkboxes based on chain
  function renderAccountSelection(chain: string) {
    if (isEIP155Chain(chain)) {
      return (
        <ProposalSelectSection
          addresses={[erc4337Address]}
          selectedAddresses={selectedAccounts[chain]}
          onSelect={onSelectAccount}
          chain={chain}
        />
      );
    }
  }

  return (
    <>
      <RequestModalContainer title="Session Proposal">
        <ProjectInfoCard metadata={peerMeta} />
        <div className="my-2"></div>
        {renderAccountSelection('eip155')}
        <div className="my-2"></div>

        <div className="modal-action">
          <button className="btn-error btn" onClick={onReject}>
            Reject
          </button>

          <button
            className="btn-success btn"
            onClick={onApprove}
            disabled={!hasSelected}
          >
            Approve
          </button>
        </div>
      </RequestModalContainer>
    </>
  );
}
