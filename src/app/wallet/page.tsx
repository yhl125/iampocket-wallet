import TransactionResultModal from '@/components/transfer/TransactionResultModal';
import Wallet from '@/components/wallet/wallet';
import Modal from '@/components/walletconnect-modal/Modal';

function WalletPage() {
  return (
    <>
      <Wallet />
      <TransactionResultModal />
      <Modal />
    </>
  );
};
export default WalletPage;
