import TransactionResultModal from '@/components/transfer/TransactionResultModal';
import Wallet from '@/components/wallet/wallet';
import Modal from '@/components/walletconnect-modal/Modal';

export default function WalletPage() {
  return (
    <>
      <Wallet />
      <TransactionResultModal />
      <Modal />
    </>
  );
}
