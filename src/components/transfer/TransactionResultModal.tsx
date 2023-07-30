'use client'

import { useSnapshot } from 'valtio';
import TransactionModalStore from '@/store/TransactionModalStore';

const TransactionResultModal = () => {
  const { open, data } = useSnapshot(TransactionModalStore.state);
  return (
    <>
      <input
        type="checkbox"
        id="transaction-result-modal"
        className="modal-toggle"
        checked={open}
        readOnly
      />
      <div className="modal">
        <div className="modal-box w-80">
        <h3 className="text-2xl font-bold mb-4">Transaction Result</h3>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <td>From</td>
                  <td></td>
                  <td>{data.from}</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <td>To</td>
                  <td></td>
                  <td>{data.to}</td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td></td>
                  <td>{data.amount}</td>
                </tr>
                <tr>
                  <td>Value</td>
                  <td></td>
                  <td>{data.value}</td>
                </tr>
                <tr>
                  <td>Network</td>
                  <td></td>
                  <td>{data.network}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <a
            className="link-accent link"
            href={`https://app.jiffyscan.xyz/userOpHash/${data.hash}`}
            target="_blank"
          >
            View on Explorer
          </a>
          <div className="modal-action">
            <button
              className="btn-error btn"
              onClick={() => TransactionModalStore.close()}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionResultModal;
