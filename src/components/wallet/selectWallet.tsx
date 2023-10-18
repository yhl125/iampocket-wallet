import AddressStore, { selectedWalletType } from '@/store/AddressStore';
import { truncateAddress } from '@/utils/HelperUtil';
import { useSnapshot } from 'valtio';

export default function SelectWallet() {
  const {
    pkpViemAddress,
    zeroDevAddress,
    selectedWallet,
  } = useSnapshot(AddressStore.state);
  const getSelectedWallet = (selectedWallet: selectedWalletType) => {
    if (selectedWallet === 'zeroDev') return 'ZeroDev';
    else if (selectedWallet === 'pkpViem') return 'EOA';
  };
  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn m-1">
        {getSelectedWallet(selectedWallet)}
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box z-[1] w-fit bg-base-100 p-2 shadow"
      >
        <li>
          <a onClick={() => AddressStore.setSelectedWallet('zeroDev')}>
            <span>ZeroDev: </span>
            {truncateAddress(zeroDevAddress)}
          </a>
        </li>
        <li>
          <a onClick={() => AddressStore.setSelectedWallet('pkpViem')}>
            <span>EOA Viem Wallet: </span>
            {truncateAddress(pkpViemAddress)}
          </a>
        </li>
      </ul>
    </div>
  );
}
