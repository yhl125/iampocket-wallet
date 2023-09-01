import { EIP155_CHAINS } from '@/data/EIP155Data';
import Image from 'next/image';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import { ChainData, TokenData } from '@/data/SquidData';
import SquidStore from '@/store/SquidStore';
import { useState } from 'react';
import { useSnapshot } from 'valtio';

interface toBoxProps {
  setView: any;
  selectedToChain: ChainData;
  selectedToToken: TokenData;
}

export default function ToBox({
  setView,
  selectedToChain,
  selectedToToken,
}: toBoxProps) {
  return (
    <div className="to-box">
      <div className="to-box-header mb-2 flex items-center justify-between">
        <div>To</div>
        <ArrowDownIcon className="h-8 rounded-xl border-2 border-black p-1" />
        <span className="w-7 justify-end"></span>
      </div>
      <div className="select-to-chain-token-box gap-2 rounded-2xl border-2 bg-gray-100 p-2">
        <div className="select-to-chain-token flex justify-between">
          <button
            onClick={() => {
              setView('chainTo');
            }}
            className="btn btn-outline flex h-8 min-h-min w-36 content-center justify-between rounded-3xl bg-white p-1"
          >
            <div className="avatar">
              <div className="w-6 rounded-full">
                <Image
                  src={selectedToChain.chainIconURI}
                  width={20}
                  height={20}
                  alt={'chain logo'}
                  className="mask mask-circle"
                ></Image>
              </div>
            </div>
            <div>{selectedToChain.chainName}</div>
            <ChevronDownIcon className="h-3" />
          </button>
          <button
            onClick={() => {
              setView('tokenTo');
            }}
            className="btn btn-outline flex h-8 min-h-min w-36 content-center justify-between rounded-3xl bg-white p-1"
          >
            <div className="avatar">
              <div className="w-6 rounded-full">
                <Image
                  src={selectedToToken.logoURI}
                  width={20}
                  height={20}
                  alt={'chain logo'}
                  className="mask mask-circle"
                ></Image>
              </div>
            </div>
            <div>{selectedToToken.name}</div>
            <ChevronDownIcon className="h-3" />
          </button>
        </div>
        <div className="to-value">
          <div className="text-2xl">0</div>
        </div>
        <div className="to-value-to-dollar-balance flex justify-between text-gray-600/[.5]">
          <div>$0</div>
          <div>Balance: 0 USDC</div>
        </div>
      </div>
    </div>
  );
}