'use client';

import { useRouter } from 'next/navigation';

const MainPage = () => {
  const router = useRouter();
  return (
    <div className="hero mt-24">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold">Welcome to iamPocket</h1>
          <div className="mb-24 mt-14">
            <h2 className="text-2xl">Wallet for all </h2>
            <h2 className="text-2xl">Wallet for you </h2>
          </div>
          <button
            className="btn-wide btn text-white"
            onClick={() => router.push('/wallet')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;