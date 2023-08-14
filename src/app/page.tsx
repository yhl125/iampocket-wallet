'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import MainPage from './main/page';
import AddressStore from '@/store/AddressStore';

const Home = () => {
  const { erc4337Address } = useSnapshot(AddressStore.state);
  const router = useRouter();
  useEffect(() => {
    if (erc4337Address != '') router.push('/wallet');
  }, [erc4337Address, router]);

  return <MainPage />;
};

export default Home;
