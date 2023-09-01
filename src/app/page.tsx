'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import MainPage from './main/page';
import AddressStore from '@/store/AddressStore';

function Home() {
  const { zeroDevAddress } = useSnapshot(AddressStore.state);
  const router = useRouter();
  useEffect(() => {
    if (zeroDevAddress != '') router.push('/wallet');
  }, [zeroDevAddress, router]);

  return <MainPage />;
};

export default Home;
