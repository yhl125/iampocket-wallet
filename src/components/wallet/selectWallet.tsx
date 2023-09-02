import AddressStore from '@/store/AddressStore';
import { truncateAddress } from '@/utils/HelperUtil';
import { useSnapshot } from 'valtio';

export default function SelectWallet() {
  const { zeroDevAddress, biconomyAddress, selectedWallet } = useSnapshot(
    AddressStore.state,
  );
  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn m-1">
        {selectedWallet === 'biconomy' ? 'Biconomy' : 'ZeroDev'}
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
      </ul>
    </div>
  );
}
