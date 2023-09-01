import { ChainData, TokenData } from '@/data/SquidData';
import SquidStore from '@/store/SquidStore';
import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import Image from 'next/image';

interface ChainViewProps {
  setView: any;
  setSelectedChain: any;
  selectedChain: ChainData;
}

export function ChainView({
  setView,
  setSelectedChain,
  selectedChain,
}: ChainViewProps) {
  const { chainDataList } = useSnapshot(SquidStore.state);
  const [searchKey, setSearchkey] = useState<string>('');
  const filteredChainList =
    searchKey === ''
      ? chainDataList
      : chainDataList.filter((chain) =>
          chain.chainName.toLowerCase().includes(searchKey.toLowerCase()),
        );
  return (
    <div className="chain-container px-5">
      <div className="header flex flex-row items-center justify-between py-4">
        <span className="w-7 justify-end"></span>
        <div className="font-bold">Select Chain</div>
        <button
          onClick={() => {
            setView('default');
          }}
        >
          back
        </button>
      </div>
      <div className="search-form form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Search Chains</span>
        </label>
        <input
          type="text"
          placeholder="Search Chain Here"
          onChange={(e: any) => {
            setSearchkey(e.target.value);
          }}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="mt-2 font-bold">Supported Chains</div>
      <div className="chains-list h-96 overflow-auto">
        {filteredChainList.map((chain, idx: number) => (
          <div
            key={idx}
            className="flex content-center justify-between p-2 hover:bg-gray-200"
            onClick={() => {
              setSelectedChain(chain);
            //   const sameToken = tokenDataList.find((tokenData) => {
            //     tokenData.chainId === chain.chainId &&
            //       tokenData.coingeckoId === selectedToken.coingeckoId;
            //   });
            //   console.log(sameToken);
              //   setSelectedToken(
              //     sameToken
              //       ? sameToken
              //       : tokenDataList.find((tokenData) => {
              //           tokenData.chainId === chain.chainId;
              //         }),
              //   );
              setView('default');
            }}
          >
            <div className="chain-logo-name flex">
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <Image
                    src={chain.chainIconURI}
                    width={20}
                    height={20}
                    alt={'chain logo'}
                    className="mask mask-circle"
                  ></Image>
                </div>
              </div>
              <div className="jusitfy-center mx-4 flex items-center">
                <div>{chain.chainName}</div>
              </div>
            </div>
            <div className="">
              {chain.chainId === selectedChain.chainId ? (
                <div>
                  <CheckIcon className="h-6"></CheckIcon>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
