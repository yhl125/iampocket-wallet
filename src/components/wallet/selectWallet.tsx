import AddressStore from '@/store/AddressStore';
import { truncateAddress } from '@/utils/HelperUtil';
import { useSnapshot } from 'valtio';

export default function SelectWallet() {
  const { zeroDevAddress, biconomyAddress, pkpEthersAddress, selectedWallet } =
    useSnapshot(AddressStore.state);
  const getSelectedWallet = (
    selectedWallet: 'zeroDev' | 'biconomy' | 'pkpEthers',
  ) => {
    if (selectedWallet === 'zeroDev') return 'ZeroDev';
    else if (selectedWallet === 'biconomy') return 'Biconomy';
    else if (selectedWallet === 'pkpEthers') return 'EOA';
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
          <a onClick={() => AddressStore.setSelectedWallet('biconomy')}>
            <span>Biconomy: </span>
            {truncateAddress(biconomyAddress)}
          </a>
        </li>
        <li>
          <a onClick={() => AddressStore.setSelectedWallet('pkpEthers')}>
            <span>EOA Wallet: </span>
            {truncateAddress(pkpEthersAddress)}
          </a>
        </li>
      </ul>
    </div>
  );
}
