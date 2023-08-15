'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';

function BottomNavigationBar() {
  const pathName = usePathname();
  const router = useRouter();
  if(pathName == '/') {
    return null;
  }
  return (
    <div className="btm-nav relative">
      <button className={`${pathName == '/wallet' ? 'active' : ''}`} onClick={()=>router.push('/wallet')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
      </button>
      <button className={`${pathName == '/something' ? 'active' : ''}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <button className={`${pathName == '/activity' ? 'active' : ''}`} onClick={()=>router.push('/activity')}>
          <ClockIcon className="h-6 w-6 text-current" />
      </button>
    </div>
  );
};

export default BottomNavigationBar;