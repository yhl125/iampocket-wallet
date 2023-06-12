'use client';

import Conditional from '@/components/ConditionalRender';
import { ethers } from 'ethers';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import TokenStore, { TokenState } from '@/store/TokenStore';
import SettingsStore from '@/store/SettingsStore';
import { useRouter } from 'next/navigation';
import { transfer, erc20Transfer } from '@/utils/transferUtils';
import PKPStore from '@/store/PKPStore';
import NetworkStore from '@/store/NetworkStore';

const TransferTokenForm = () => {
  const { tokenList } = useSnapshot(TokenStore.tokenListState);
  const [isERC20,setIsERC20] = useState<boolean>(true);
  const [withPM, setWithPM] = useState<boolean>(false);
  const mainToken = useSnapshot(TokenStore.mainTokenState);
  const [verifyAddress, setVerifyAddress] = useState<Boolean>(false);
  const [sendAmount, setSendAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState(() =>
    tokenList.length == 0 ? mainToken : tokenList[0]
  );
  const router = useRouter();
  const { erc4337Address } = useSnapshot(SettingsStore.state);
  const [recipientAddressOrEns, setRecipientAddressOrEns] =
    useState<string>('');
  const { currentPKP, authSig } = useSnapshot(PKPStore.state);

  const handleSubmit = async (event: any) => {
    if(isERC20) {
      erc20Transfer(
        selectedToken.tokenAddress,
        recipientAddressOrEns,
        String(sendAmount),
        withPM,
        currentPKP!.publicKey,
        authSig!,
        selectedToken.chainId,
      );
    }
    else {
      transfer(
        recipientAddressOrEns,
        String(sendAmount),
        withPM,
        currentPKP!.publicKey,
        authSig!,
        selectedToken.chainId
        );
    }
    event.preventDefault();
  };
  const handleChecked = (event: any) => {
    setWithPM(event.target.checked);
  };
  const handleTokenListClick = (token: TokenState) => {
    setSelectedToken(token);
    console.log(token);
  };

  useEffect(() => {
    if (!erc4337Address) router.push('/wallet');
  }, [erc4337Address, router]);
  return (
    <>
      <SearchRecipientAddress
        setVerifyAddress={setVerifyAddress}
        setRecipientAddressOrEns={setRecipientAddressOrEns}
      ></SearchRecipientAddress>
      <Conditional showWhen={verifyAddress}>
        <div>
          <div>
            <span>Your Asset: </span>
            <span>{selectedToken.name}</span>
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn m-1">
                Show Token List
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-64 p-2 shadow"
              >
                <li onClick={() => handleTokenListClick(mainToken)}>
                  <a>
                    {mainToken.name} {mainToken.balance}
                  </a>
                </li>
                {tokenList.length != 0 ? (
                  tokenList.map((token, idx) => (
                    <li key={idx} onClick={() => handleTokenListClick(token)}>
                      <a>
                        {token.name} {token.balance}
                      </a>
                    </li>
                  ))
                ) : (
                  <></>
                )}
              </ul>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Enter amount</span>
            </label>
            <label className="input-group">
              <input
                onChange={(e: any) => setSendAmount(e.target.value)}
                type="text"
                placeholder="0.0"
                className="input-bordered input"
              />
              <span>{selectedToken.tokenSymbol}</span>
            </label>
            <label className="label flex cursor-pointer justify-start">
              <span className="label-text">With PayMaster</span>
              <input
                type="checkbox"
                checked={withPM}
                onChange={handleChecked}
                className="checkbox ml-0.5"
              />
            </label>
          </div>
          {sendAmount < Number(selectedToken.balance) ? (
            <button className="btn" onClick={handleSubmit}>
              Send
            </button>
          ) : (
            <button className="btn" disabled>
              Send
            </button>
          )}
        </div>
      </Conditional>
    </>
  );
};

//SearchRecipientAddress Component
interface Props {
  setVerifyAddress: Dispatch<SetStateAction<Boolean>>;
  setRecipientAddressOrEns: Dispatch<SetStateAction<string>>;
}

const SearchRecipientAddress = ({
  setVerifyAddress,
  setRecipientAddressOrEns,
}: Props) => {
  const checkRecipientAddress = (recipientAddress: string): Boolean => {
    if (recipientAddress != '') {
      const isAddressVerified = ethers.utils.isAddress(recipientAddress);
      return isAddressVerified;
    } else return false;
  };

  return (
    <div className="p-2">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Send to</span>
        </label>
        <input
          onChange={(e: any) => {
            setVerifyAddress(checkRecipientAddress(e.target.value));
            setRecipientAddressOrEns(e.target.value);
          }}
          type="text"
          placeholder="Address(0x),ENS"
          className="input-bordered input w-full max-w-xs"
        />
      </div>
    </div>
  );
};

export default TransferTokenForm;
