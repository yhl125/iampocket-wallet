import AccountSelectCard from '@/components/walletconnect-modal/AccountSelectCard';

/**
 * Types
 */
interface IProps {
  chain: string;
  addresses: string[];
  selectedAddresses: string[] | undefined;
  onSelect: (chain: string, address: string) => void;
}

/**
 * Component
 */
export default function ProposalSelectSection({
  addresses,
  selectedAddresses,
  chain,
  onSelect,
}: IProps) {
  return (
    <div className="grid grid-flow-row auto-rows-max">
        <div>
          <h4>{`Choose ${chain} accounts`}</h4>
          {/* TODO(ilja) re-implement when duplicate optional namespaces are fixed */}
          {/* {addresses.map((address, index) => (
          <AccountSelectCard
            key={address}
            address={address}
            index={index}
            onSelect={() => onSelect(chain, address)}
            selected={selectedAddresses?.includes(address) ?? false}
          />
        ))} */}
          <AccountSelectCard
            key={addresses[0]}
            address={addresses[0]}
            index={0}
            onSelect={() => onSelect(chain, addresses[0])}
            selected={selectedAddresses?.includes(addresses[0]) ?? false}
          />
        </div>
    </div>
  );
}
