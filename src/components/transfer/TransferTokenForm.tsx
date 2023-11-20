'use client';

import Conditional from '@/components/ConditionalRender';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { useRouter } from 'next/navigation';
import {
  zeroDevTransfer,
  zeroDevErc20Transfer,
  pkpViemErc20Transfer,
  pkpViemTransfer,
} from '@/utils/transferUtils';
import PKPStore from '@/store/PKPStore';
import AddressStore from '@/store/AddressStore';
import SearchRecipientAddress from './SearchRecipientAddress';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';

import Text from '../../components/commons/Text';
import Input from '../../components/commons/Input';
import Button from '../commons/Button';
import styled from 'styled-components';
import theme from '@/styles/theme';
import DropDown from '../commons/DropDown';
import CheckBox from '../commons/CheckBox';
import Icon from '../commons/Icon';

function TransferTokenForm() {
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [isCheckedPM, setIsCheckedPM] = useState<boolean>(false);
  const [isVerifiedAddress, setIsVerifiedAddress] = useState<boolean>(false);

  const [sendAmount, setSendAmount] = useState<number>(0);
<<<<<<< Updated upstream
  const psudoToken: IResponseToken = {
=======
  const { tokenList } = useSnapshot(TokenStore.tokenListState);

  const psudoToken: TokenState = {
>>>>>>> Stashed changes
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
  const { pkpViemAddress, zeroDevAddress, selectedWallet } = useSnapshot(
    AddressStore.state,
  );
  const [recipientAddressOrEns, setRecipientAddressOrEns] =
    useState<string>('');
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);

  async function handleSubmit(event: any) {
    setIsTransactionLoading(true);
    if (!selectedToken.nativeToken) {
      if (selectedWallet === 'zeroDev') {
        await zeroDevErc20Transfer(
          selectedToken.address,
          recipientAddressOrEns,
          String(sendAmount),
          isCheckedPM,
          currentPKP!.publicKey,
          sessionSigs!,
          selectedToken.chainId,
        ).then((res) => {
          setIsTransactionLoading(false);
          //TODO: Add transaction pending state and modal for transaction result
          // TransactionModalStore.open({
          //   hash: res.hash,
          //   from: res.from,
          //   to: recipientAddressOrEns,
          //   value: res.value.toString(),
          //   tokenName: selectedToken.name,
          //   network: res.chainId.toString(),
          //   amount: String(sendAmount),
          // });
          router.push('/wallet');
        });
      } else if (selectedWallet === 'pkpViem') {
        await pkpViemErc20Transfer(
          selectedToken.address,
          recipientAddressOrEns,
          String(sendAmount),
          selectedToken.chainId,
          currentPKP!.publicKey,
          sessionSigs!,
        ).then(() => {
          //TODO: Add transaction pending state and modal for transaction result
          router.push('/wallet');
        });
      }
    } else {
      if (selectedWallet === 'zeroDev') {
        await zeroDevTransfer(
          recipientAddressOrEns,
          String(sendAmount),
          isCheckedPM,
          currentPKP!.publicKey,
          sessionSigs!,
          selectedToken.chainId,
        ).then((res) => {
          //TODO: Add transaction pending state and modal for transaction result
          setIsTransactionLoading(false);
          // TransactionModalStore.open({
          //   hash: res.hash,
          //   from: res.from,
          //   to: recipientAddressOrEns,
          //   value: res.value.toString(),
          //   tokenName: selectedToken.name,
          //   network: res.chainId.toString(),
          //   amount: String(sendAmount),
          // });
          router.push('/wallet');
        });
      } else if (selectedWallet === 'pkpViem') {
        await pkpViemTransfer(
          recipientAddressOrEns as `0x${string}`,
          String(sendAmount),
          selectedToken.chainId,
          currentPKP!.publicKey,
          sessionSigs!,
        );
      }
      event.preventDefault();
    }
  }

  const handleChecked = (event: any) => {
    setIsCheckedPM(event.target.checked);
    console.log(isCheckedPM);
  };
<<<<<<< Updated upstream
  const handleTokenListClick = (token: IResponseToken) => {
=======

  const handleTokenListClick = (token: TokenState) => {
>>>>>>> Stashed changes
    setSelectedToken(token);
  };

  useEffect(() => {
    if (!zeroDevAddress) router.push('/wallet');
  }, [router, zeroDevAddress]);
  return (
    <Container>
      <SearchRecipientAddress
        setIsVerifiedAddress={setIsVerifiedAddress}
        setRecipientAddressOrEns={setRecipientAddressOrEns}
      ></SearchRecipientAddress>

      <TransferWrapper isVerifiedAddress={isVerifiedAddress}>
        <AmountWrapper>
          <AmountTextWrapper>
            <Text size="title3" color="bg40">
              Amount
            </Text>
            <BalanceTextWrapper>
              <Text size="body3">Your Balance:</Text>
              <Text size="body3">
                {erc20BalanceToReadable(
                  selectedToken.balance,
                  selectedToken.decimals,
                )}
                {selectedToken.name}{' '}
              </Text>
            </BalanceTextWrapper>
          </AmountTextWrapper>

          <AmountInputWrapper>
            <Input
              value={String(sendAmount)}
              onChange={(e: any) => setSendAmount(e.target.value)}
              size="medium"
              type="text"
              placeholder="0.0"
              style={{ visibility: isVerifiedAddress ? `visible` : `hidden` }}
              suffixComponent={
                <Button
                  size="small"
                  text="MAX"
                  type="primary"
                  onClick={() => {}}
                />
              }
            />

            {/* <span>{selectedToken.symbol}</span> */}
            <AmountDropDownWrapper>
              <DropDown
                content={tokenList}
                selectDataState={selectedToken}
                setSelectDataState={setSelectedToken}
                iconKey="logoUrl"
                nameKey="name"
                size="medium"
              >
                {tokenList.map((token: any, idx: number) => (
                  <ul key={idx} onClick={() => handleTokenListClick(token)}>
                    {' '}
                    {token.name}{' '}
                    {erc20BalanceToReadable(token.balance, token.decimals)}
                  </ul>
                ))}
              </DropDown>
            </AmountDropDownWrapper>
            {/* 
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
            </div> */}
          </AmountInputWrapper>
        </AmountWrapper>

        <GasWrapper>
          {selectedWallet === 'pkpViem' ? null : (
            <PaymasterWrapper>
              <PaymasterCheckBoxWrapper>
                <Text size="title3" color={isCheckedPM ? 'bg0' : 'bg40'}>
                  Paymaster
                </Text>
                <CheckBox
                  checked={isCheckedPM}
                  onChange={handleChecked}
                ></CheckBox>
              </PaymasterCheckBoxWrapper>
              <PaymasterDropDownWrapper isCheckedPM={isCheckedPM}>
                <DropDown size="small">
                  {tokenList.map((data: any) => (
                    <ul key={data.key}>{data}</ul>
                  ))}
                </DropDown>
              </PaymasterDropDownWrapper>
            </PaymasterWrapper>
          )}
          <EstimatedGasBoxWrapper>
            <EstimatedGasTextWrapper>
              <Text size="body2" color="bg40">
                Estimated GAS
              </Text>
              <Icon type="gas" color="bg40" height="title3" />
            </EstimatedGasTextWrapper>
            <Text>0.0000000012</Text>
          </EstimatedGasBoxWrapper>
        </GasWrapper>

        <Button
          text={
            isTransactionLoading
              ? 'Transaction In Progress...'
              : sendAmount <
                Number(
                  erc20BalanceToReadable(
                    selectedToken.balance,
                    selectedToken.decimals,
                  ),
                )
              ? 'Send'
              : 'Enter Amount'
          }
          size="large"
          type="primary"
          disabled={
            isTransactionLoading
              ? true
              : sendAmount <
                Number(
                  erc20BalanceToReadable(
                    selectedToken.balance,
                    selectedToken.decimals,
                  ),
                )
              ? false
              : true
          }
          onClick={handleSubmit}
        />
      </TransferWrapper>
    </Container>
  );
}

const Container = styled.div``;

const TransferWrapper = styled.div<{ isVerifiedAddress: boolean }>`
  display: flex;
  flex-direction: column;
  transition: opacity 0.7s ease;
  row-gap: ${theme.space.medium};
  margin-top: ${theme.space.medium};
  opacity: ${({ isVerifiedAddress }) => (isVerifiedAddress ? 1 : 0.2)};
  pointer-events: ${({ isVerifiedAddress }) =>
    isVerifiedAddress ? `auto` : `none`};
`;

const AmountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.xTiny};
`;

const AmountTextWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const BalanceTextWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
`;

const AmountInputWrapper = styled.div`
  display: flex;
  gap: ${theme.space.xTiny};
`;

const AmountDropDownWrapper = styled.div`
  width: 40%;
`;

// const InputWrapper = styled.div`
//   width: 70%;
// `;
// const DropDownWrapper = styled.div`
//   width: 30%;
// `;
const GasWrapper = styled.div`
  display: flex;
  gap: ${theme.space.small};
`;

const PaymasterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xSmall};
`;

const PaymasterCheckBoxWrapper = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: ${theme.space.xSmall};
`;

const PaymasterDropDownWrapper = styled.div<{ isCheckedPM: boolean }>`
  transition: opacity 0.7s ease;
  opacity: ${({ isCheckedPM }) => (isCheckedPM ? 1 : 0.2)};
  pointer-events: ${({ isCheckedPM }) => (isCheckedPM ? `auto` : `none`)};
`;

const EstimatedGasBoxWrapper = styled.div`
  gap: ${theme.space.xTiny};
  border: 1px solid ${theme.color.bg50};
  padding: ${theme.space.xSmall} ${theme.space.sMedium};
  display: flex;
  width: 44%;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  border-radius: 5px;
  background-color: transparent;
`;

const EstimatedGasTextWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default TransferTokenForm;
