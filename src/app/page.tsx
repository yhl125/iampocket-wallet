'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import MainPage from './main/page';
import SettingsStore from './store/SettingsStore';

export default function Home() {
  const { erc4337Address } = useSnapshot(SettingsStore.state);
  const router = useRouter();
  useEffect(() => {
    if (erc4337Address != '') router.push('/wallet');
  }, []);

  return <MainPage />;
}
