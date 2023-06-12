import ProjectInfoCard from '@/components/walletconnect-modal/ProjectInfoCard';
import ProposalSelectSection from '@/components/walletconnect-modal/ProposalSelectSection';
import RequestModalContainer from '@/components/walletconnect-modal/RequestModalContainer';
import ModalStore from '@/store/ModalStore';
import SettingsStore from '@/store/SettingsStore';
import { isEIP155Chain } from '@/utils/HelperUtil';
import { web3wallet } from '@/utils/WalletConnectUtil';
import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { Fragment, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';
import ConnectedAppStore from '@/store/ConnectedAppStore';

export default function SessionProposalModal() {
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, string[]>
  >({});
  const hasSelected = Object.keys(selectedAccounts).length;
  const { erc4337Address } = useSnapshot(SettingsStore.state);
  const router = useRouter();

  // Get proposal data and wallet address from store
  const proposal = ModalStore.state.data?.proposal;
  useEffect(() => {
    console.log('selectedAccounts', selectedAccounts);
  }, [selectedAccounts]);

  // Ensure proposal is defined
  if (!proposal) {
    return <p>Missing proposal data</p>;
  }

  // Get required proposal data
  const { id, params } = proposal;

  const { proposer, requiredNamespaces, optionalNamespaces, relays } = params;

  const requiredNamespaceKeys = requiredNamespaces
    ? Object.keys(requiredNamespaces)
    : [];
  const optionalNamespaceKeys = optionalNamespaces
    ? Object.keys(optionalNamespaces)
    : [];

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
      let namespaces: SessionTypes.Namespaces = {};
      const selectedOptionalNamespaces = [];
      for (const [chain, account] of Object.entries(selectedAccounts)) {
        if (chain.includes('optional')) {
          selectedOptionalNamespaces.push(chain.split(':')[1]);
        }
      }

      console.log('selectedOptionalNamespaces', selectedOptionalNamespaces);

      requiredNamespaceKeys
        .concat(selectedOptionalNamespaces)
        .forEach((key) => {
          const accounts: string[] = [];
          if (requiredNamespaces[key].chains) {
            requiredNamespaces[key].chains?.map((chain) => {
              selectedAccounts[`required:${key}`].map((acc) =>
                accounts.push(`${chain}:${acc}`)
              );
            });
            namespaces[key] = {
              accounts,
              methods: requiredNamespaces[key].methods,
              events: requiredNamespaces[key].events,
              chains: requiredNamespaces[key].chains,
            };
          }
          if (optionalNamespaces[key] && selectedAccounts[`optional:${key}`]) {
            optionalNamespaces[key].chains?.map((chain) => {
              selectedAccounts[`optional:${key}`].map((acc) =>
                accounts.push(`${chain}:${acc}`)
              );
            });
            namespaces[key] = {
              ...namespaces[key],
              accounts,
              methods: optionalNamespaces[key].methods,
              events: optionalNamespaces[key].events,
              chains: namespaces[key].chains?.concat(
                optionalNamespaces[key].chains || []
              ),
            };
          }
        });

      console.log('namespaces', namespaces);
      const approvedSession = await web3wallet.approveSession({
        id,
        relayProtocol: relays[0].protocol,
        namespaces,
      });
      // https://docs.walletconnect.com/2.0/advanced/glossary#expiry
      const expiryDate = new Date(approvedSession.expiry * 1000 + Date.now());

      ConnectedAppStore.addConnectedApp(
        approvedSession.topic,
        expiryDate,
        proposer.metadata
      );
    }
    ModalStore.close();
    router.back();
  }

  // Hanlde reject action
  async function onReject() {
    if (proposal) {
      await web3wallet.rejectSession({
        id,
        reason: getSdkError('USER_REJECTED_METHODS'),
      });
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
        <ProjectInfoCard metadata={proposer.metadata} />

        <div className="my-2"></div>

        {requiredNamespaceKeys.length ? <h4>Required Namespaces</h4> : null}
        {requiredNamespaceKeys.map((chain) => {
          return (
            <Fragment key={chain}>
              <p className="mb-5">{`Review ${chain} permissions`}</p>
              {renderAccountSelection(`required:${chain}`)}
              <div className="my-2"></div>
            </Fragment>
          );
        })}
        {optionalNamespaceKeys ? <h4>Optional Namespaces</h4> : null}
        {optionalNamespaceKeys.length &&
          optionalNamespaceKeys.map((chain) => {
            return (
              <Fragment key={chain}>
                <p className="mb-5">{`Review ${chain} permissions`}</p>
                {renderAccountSelection(`optional:${chain}`)}
                <div className="my-2"></div>
              </Fragment>
            );
          })}
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
