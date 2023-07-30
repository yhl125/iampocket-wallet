'use client';

import Conditional from '@/components/ConditionalRender';
import { BigNumber, ethers } from 'ethers';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import TokenStore, { TokenState } from '@/store/TokenStore';
import { useRouter } from 'next/navigation';
import { transfer, erc20Transfer } from '@/utils/transferUtils';
import PKPStore from '@/store/PKPStore';
import AddressStore from '@/store/AddressStore';
import TransactionModalStore from '@/store/TransactionModalStore';

const TransferTokenForm = () => {
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
  const { tokenList } = useSnapshot(TokenStore.tokenListState);
  const [withPM, setWithPM] = useState<boolean>(false);
  const [verifyAddress, setVerifyAddress] = useState<Boolean>(false);
  const [sendAmount, setSendAmount] = useState<number>(0);
  const psudoToken: TokenState = {
    address: '',
    name: 'Sudo Token',
    symbol: 'SUDO',
    decimals: 18,
    logoUrl: '',
    nativeToken: false,
    type: '',
    balance: '0',
    quote: 0,
    prettyQuote: '0',
    quoteRate: 0,
    quoteRate24hAgo: 0,
    chainId: 80001,
  };
  const [selectedToken, setSelectedToken] = useState(() =>
    tokenList.length == 0 ? psudoToken : tokenList[0]
  );
  const router = useRouter();
  const { erc4337Address } = useSnapshot(AddressStore.state);
  const [recipientAddressOrEns, setRecipientAddressOrEns] =
    useState<string>('');
  const { currentPKP, authSig } = useSnapshot(PKPStore.state);

  const handleSubmit = async (event: any) => {
    if(!selectedToken.nativeToken) {
      erc20Transfer(
        selectedToken.address,
        recipientAddressOrEns,
        String(sendAmount),
        withPM,
        currentPKP!.publicKey,
        authSig!,
        selectedToken.chainId
      ).then((res) => {
        console.log(res);
        setTransactionLoading(false);
        TransactionModalStore.open({
          hash: res.hash,
          from: res.from,
          to: recipientAddressOrEns,
          value: res.value.toString(),
          tokenName: selectedToken.name,
          network: res.chainId.toString(),
          amount: String(sendAmount),
        });
        router.push('/wallet');
      });
    } else {
      await transfer(
        recipientAddressOrEns,
        String(sendAmount),
        withPM,
        currentPKP!.publicKey,
        authSig!,
        selectedToken.chainId
      ).then((res) => {
        setTransactionLoading(false);
        TransactionModalStore.open({
          hash: res.hash,
          from: res.from,
          to: recipientAddressOrEns,
          value: res.value.toString(),
          tokenName: selectedToken.name,
          network: res.chainId.toString(),
          amount: String(sendAmount),
        });
        router.push('/wallet');
      });
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
            <span>
              {selectedToken.name} {selectedToken.balance}
            </span>
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn m-1">
                Show Token List
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-64 p-2 shadow"
              >
                {/* <li onClick={() => handleTokenListClick(mainToken)}>
                  <a>
                    {mainToken.name} {mainToken.balance}
                  </a>
                </li> */}
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
              <span>{selectedToken.symbol}</span>
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
      {transactionLoading ? (
        <>
          Transaction In Progress...
        </>
      ) : null}
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
