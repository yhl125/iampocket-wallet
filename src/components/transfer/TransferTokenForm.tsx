'use client';

import Conditional from '@/components/ConditionalRender';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import TokenStore, { TokenState } from '@/store/TokenStore';
import { useRouter } from 'next/navigation';
import {
  zeroDevTransfer,
  zeroDevErc20Transfer,
  biconomyErc20Transfer,
  biconomyTransfer,
} from '@/utils/transferUtils';
import PKPStore from '@/store/PKPStore';
import AddressStore from '@/store/AddressStore';
import TransactionModalStore from '@/store/TransactionModalStore';
import SearchRecipientAddress from './SearchRecipientAddress';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';

function TransferTokenForm() {
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
  const { tokenList } = useSnapshot(TokenStore.tokenListState);
  const [withPM, setWithPM] = useState<boolean>(false);
  const [verifyAddress, setVerifyAddress] = useState<Boolean>(false);
  const [sendAmount, setSendAmount] = useState<number>(0);
  const psudoToken: TokenState = {
    address: '',
    name: 'Token',
    symbol: 'Token',
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
    tokenList.length == 0 ? psudoToken : tokenList[0],
  );
  const router = useRouter();
  const { zeroDevAddress, selectedWallet } = useSnapshot(AddressStore.state);
  const [recipientAddressOrEns, setRecipientAddressOrEns] =
    useState<string>('');
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);

  async function handleSubmit(event: any) {
    setTransactionLoading(true);
    if (!selectedToken.nativeToken) {
      if (selectedWallet === 'biconomy') {
        await biconomyErc20Transfer(
          selectedToken.address,
          recipientAddressOrEns,
          String(sendAmount),
          currentPKP!.publicKey,
          sessionSigs!,
          selectedToken.chainId,
        ).then((res) => {
          setTransactionLoading(false);
          router.push('/wallet');
        });
      } else {
        await zeroDevErc20Transfer(
          selectedToken.address,
          recipientAddressOrEns,
          String(sendAmount),
          withPM,
          currentPKP!.publicKey,
          sessionSigs!,
          selectedToken.chainId,
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
    } else {
      if (selectedWallet === 'biconomy') {
        await biconomyTransfer(
          recipientAddressOrEns,
          String(sendAmount),
          currentPKP!.publicKey,
          sessionSigs!,
          selectedToken.chainId,
        ).then((res) => {
          setTransactionLoading(false);
          router.push('/wallet');
        });
      } else {
        await zeroDevTransfer(
          recipientAddressOrEns,
          String(sendAmount),
          withPM,
          currentPKP!.publicKey,
          sessionSigs!,
          selectedToken.chainId,
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
    }
    event.preventDefault();
  };
  const handleChecked = (event: any) => {
    setWithPM(event.target.checked);
  };
  const handleTokenListClick = (token: TokenState) => {
    setSelectedToken(token);
  };

  useEffect(() => {
    if (!zeroDevAddress) router.push('/wallet');
  }, [zeroDevAddress, router]);
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
              {selectedToken.name}{' '}
              {erc20BalanceToReadable(
                selectedToken.balance,
                selectedToken.decimals,
              )}
            </span>
            <div className="dropdown">
              <label tabIndex={0} className="btn m-1">
                Show Token List
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content rounded-box z-[1] w-52 bg-base-100 p-2 shadow"
              >
                {tokenList.length != 0 ? (
                  tokenList.map((token, idx) => (
                    <li key={idx} onClick={() => handleTokenListClick(token)}>
                      <a>
                        {token.name}{' '}
                        {erc20BalanceToReadable(token.balance, token.decimals)}
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
                className="input input-bordered"
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
          {sendAmount <
          Number(
            erc20BalanceToReadable(
              selectedToken.balance,
              selectedToken.decimals,
            ),
          ) ? (
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
      {transactionLoading ? <>Transaction In Progress...</> : null}
    </>
  );
}

export default TransferTokenForm;
