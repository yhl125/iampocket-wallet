import { truncate } from '@/utils/HelperUtil';

/**
 * Types
 */
interface IProps {
  address: string;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Component
 */
export default function AccountSelectCard({
  address,
  selected,
  index,
  onSelect,
}: IProps) {
  return (
    <>
      <div
        className={`card w-96 bg-base-100 shadow-xl ${
          selected ? 'bg-green-500' : 'bg-gray-500'
        }`}
      >
        <div className="card-body">
          <input
            id={`account-${index}-checkbox`}
            type="checkbox"
            checked={selected}
            className="checkbox"
            onChange={onSelect}
          />
          <label
            htmlFor={`account-${index}-checkbox`}
            className="text-2xl"
          >{`${truncate(address, 14)} - Account ${index}`}</label>
        </div>
      </div>
    </>
  );
}
