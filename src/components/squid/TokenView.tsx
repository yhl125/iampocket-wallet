import { ChainData, TokenData } from '@/data/SquidData';
import SquidStore from '@/store/SquidStore';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import Image from 'next/image';

interface TokenViewProps {
  setView: any;
  selectedChain: ChainData;
  setSelectedToken: any;
  selectedToken: TokenData;
}

export default function TokenView(props: TokenViewProps) {
  const [searchKey, setSearchkey] = useState<string>('');
  const { tokenDataList } = useSnapshot(SquidStore.state);
  const filteredTokenList =
    searchKey === ''
      ? tokenDataList.filter(
          (token) => token.chainId === props.selectedChain.chainId,
        )
      : tokenDataList.filter(
          (token) =>
            token.name.toLowerCase().includes(searchKey.toLowerCase()) &&
            token.chainId === props.selectedChain.chainId,
        );

  useEffect(() => {
    props.setSelectedToken(
      tokenDataList.filter(
        (token) => props.selectedChain.chainId === token.chainId,
      )[0],
    );
  }, [props, props.selectedChain, tokenDataList]);
  return (
    <div className="token-container px-5">
      <div className="header flex flex-row items-center justify-between py-4">
        <span className="w-7 justify-end"></span>
        <div className="font-bold">Select Token</div>
        <button
          onClick={() => {
            props.setView('default');
          }}
        >
          back
        </button>
      </div>
      <div className="search-form form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Search Tokens</span>
        </label>
        <input
          type="text"
          placeholder="Search Token Here"
          onChange={(e: any) => {
            setSearchkey(e.target.value);
          }}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="my-2  flex content-center justify-between">
        <div className="flex items-center font-bold">Supported Tokens</div>
        <button
          onClick={() => {
            props.setView('chain');
          }}
          className="btn btn-outline flex h-8 min-h-min w-36 content-center justify-between rounded-3xl bg-white p-1"
        >
          <div className="avatar">
            <div className="w-6 rounded-full">
              <Image
                src={props.selectedChain.chainIconURI}
                width={20}
                height={20}
                alt={'chain logo'}
                className="mask mask-circle"
              ></Image>
            </div>
          </div>
          <div>{props.selectedChain.chainName}</div>
          <ChevronDownIcon className="h-3" />
        </button>
      </div>
      <div className="chains-list h-96 overflow-auto">
        {filteredTokenList.map((token, idx: number) => (
          <div
            key={idx}
            className="flex content-center justify-between p-2 hover:bg-gray-200"
            onClick={() => {
              props.setSelectedToken(token);
              props.setView('default');
            }}
          >
            <div className="chain-logo-name flex">
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <Image
                    src={token.logoURI}
                    width={20}
                    height={20}
                    alt={'chain logo'}
                    className="mask mask-circle"
                  ></Image>
                </div>
              </div>
              <div className="jusitfy-center mx-4 flex items-center">
                <div>{token.name}</div>
              </div>
            </div>
            <div className="">
              {props.selectedToken.name === token.name ? (
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
