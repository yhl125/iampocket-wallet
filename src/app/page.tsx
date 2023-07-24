'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import MainPage from './main/page';
import AddressStore from '@/store/AddressStore';

export default function Home() {
  const { erc4337Address } = useSnapshot(AddressStore.state);
  const router = useRouter();
  useEffect(() => {
    if (erc4337Address != '') router.push('/wallet');
  }, [erc4337Address, router]);

  return <MainPage />;
}
