import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ChainData, TokenData } from '@/data/SquidData';

interface fromBoxProps {
  setView: any;
  selectedChain: ChainData;
  selectedToken: TokenData;
  setSendAmount: any;
}

export default function FromBox({
  setView,
  selectedChain,
  selectedToken,
  setSendAmount,
}: fromBoxProps) {
  return (
    <div className="from-box mb-2">
      <div className="from-box-header mb-2">
        <div>From</div>
      </div>
      <div className="select-from-chain-token-box gap-2 rounded-2xl border-2 bg-gray-100 p-2">
        <div className="select-from-chain-token flex justify-between">
          <button
            onClick={() => {
              setView('chainFrom');
            }}
            className="btn btn-outline flex h-8 min-h-min w-36 content-center justify-between rounded-3xl bg-white p-1"
          >
            <div className="avatar">
              <div className="w-6 rounded-full">
                <Image
                  src={selectedChain.chainIconURI}
                  width={20}
                  height={20}
                  alt={'chain logo'}
                  className="mask mask-circle"
                ></Image>
              </div>
            </div>
            <div>{selectedChain.chainName}</div>
            <ChevronDownIcon className="h-3" />
          </button>
          <button
            onClick={() => {
              setView('tokenFrom');
            }}
            className="btn btn-outline flex h-8 min-h-min w-36 content-center justify-between rounded-3xl bg-white p-1"
          >
            <div className="avatar">
              <div className="w-6 rounded-full">
                <Image
                  src={selectedToken.logoURI}
                  width={20}
                  height={20}
                  alt={'chain logo'}
                  className="mask mask-circle"
                ></Image>
              </div>
            </div>
            <div>{selectedToken.name}</div>
            <ChevronDownIcon className="h-3" />
          </button>
        </div>
        <div className="from-value">
          <div className="search-form form-control my-2 w-full max-w-xs">
            <input
              type="text"
              placeholder="0"
              onChange={(e: any) => {
                setSendAmount(e.target.value);
              }}
              className="input input-bordered w-full max-w-xs text-2xl"
            />
          </div>
        </div>
        <div className="from-value-to-dollar-balance flex justify-between text-gray-600/[.5]">
          <div>$0</div>
          <div>Balance: 0 USDC</div>
        </div>
      </div>
    </div>
  );
}
