'use client';

import { useRouter } from 'next/navigation';
import TransferTokenForm from '@/components/transfer/TransferTokenFrom';

const TransferToken = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex w-full items-center justify-center border-b-2">
        <h1 className="text-2xl">Transfer</h1>
        <button onClick={() => router.back()} className="btn-xs btn">
          Cancel
        </button>
      </div>
      <TransferTokenForm></TransferTokenForm>
    </>
  );
};

export default TransferToken;
