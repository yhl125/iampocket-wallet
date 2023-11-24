import QRCode from 'react-qr-code';
import Text from '@/components/commons/Text';

export default function DepositModal(props: { address: string }) {
  return (
    <>
      <button
        className="btn btn-sm"
        onClick={() =>
          (
            document.getElementById('deposit_modal') as HTMLFormElement
          ).showModal()
        }
      >
        Deposit
      </button>
      <dialog id="deposit_modal" className="modal">
        <div className="modal-box flex-col">
          <Text>Scan to Deposit</Text>
          <QRCode value={props.address} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
