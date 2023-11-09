'use client';

import { useRouter } from 'next/navigation';
import TransferTokenForm from '@/components/transfer/TransferTokenForm';

function TransferToken() {
  const router = useRouter();
  return (
    <>
      <div className="flex h-1/6 items-center justify-center border-b-2">
        <h1 className="text-2xl">Transfer</h1>
        <button onClick={() => router.back()} className="btn btn-xs">
          Cancel
        </button>
      </div>
      <TransferTokenForm></TransferTokenForm>
    </>
  );
}

export default TransferToken;
