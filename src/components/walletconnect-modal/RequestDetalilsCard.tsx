import { EIP155_CHAINS, TEIP155Chain } from '@/data/EIP155Data';
import { Fragment } from 'react';

/**
 * Types
 */
interface IProps {
  chains: string[];
  protocol: string;
}

/**
 * Component
 */
function RequesDetailsCard({ chains, protocol }: IProps) {
  return (
    <Fragment>
      <div>
        <h5>Blockchain(s)</h5>
        <p>
          {chains
            .map((chain) => EIP155_CHAINS[chain as TEIP155Chain]?.name ?? chain)
            .join(', ')}
        </p>
      </div>

      <div className="my-2"></div>

      <div>
        <h5>Relay Protocol</h5>
        <p>{protocol}</p>
      </div>
    </Fragment>
  );
};
export default RequesDetailsCard;
