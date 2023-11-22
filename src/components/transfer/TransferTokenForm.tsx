'use client';

import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

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

import theme from '@/styles/theme';
import Text from '../../components/commons/Text';
import Input from '../../components/commons/Input';
import Button from '../commons/Button';
import DropDown from '../commons/DropDown';
import CheckBox from '../commons/CheckBox';
import Icon from '../commons/Icon';

function TransferTokenForm() {
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const { tokenList } = useSnapshot<any>(TokenStore.tokenListState);
  const [isCheckedPM, setIsCheckedPM] = useState<boolean>(false);
  const [isVerifiedAddress, setIsVerifiedAddress] = useState<boolean>(false);

  const [sendAmount, setSendAmount] = useState<number>(0);

  const psudoToken: IResponseToken = {
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

  useEffect(() => {
    if (!zeroDevAddress) router.push('/wallet');
  }, [router, zeroDevAddress]);

  const checkDisable = () => {
    if (
      isTransactionLoading ||
      sendAmount >
        Number(
          erc20BalanceToReadable(selectedToken.balance, selectedToken.decimals),
        ) ||
      Number(sendAmount) === 0
    )
      return true;
    else false;
  };

  return (
    <Container>
      <SearchRecipientAddress
        isVerifiedAddress={isVerifiedAddress}
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
              <Text size="body3" $thin>
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
              error={
                sendAmount >
                Number(
                  erc20BalanceToReadable(
                    selectedToken.balance,
                    selectedToken.decimals,
                  ),
                )
                  ? { message: 'Insufficient Your Balance' }
                  : { message: '' }
              }
              style={{ visibility: isVerifiedAddress ? `visible` : `hidden` }}
              suffixComponent={
                <Button
                  size="small"
                  text="MAX"
                  type="primary"
                  onClick={() => {
                    setSendAmount(
                      Number(
                        erc20BalanceToReadable(
                          selectedToken.balance,
                          selectedToken.decimals,
                        ),
                      ),
                    );
                  }}
                />
              }
            ></Input>
            <AmountDropDownWrapper>
              <DropDown
                contents={tokenList}
                selectContentState={selectedToken}
                setSelectContentState={setSelectedToken}
                iconKey="logoUrl"
                nameKey="name"
                size="medium"
              ></DropDown>
            </AmountDropDownWrapper>
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
                  checkState={isCheckedPM}
                  setCheckState={setIsCheckedPM}
                ></CheckBox>
              </PaymasterCheckBoxWrapper>
              {/* TODO : <PaymasterDropDownWrapper isCheckedPM={isCheckedPM}>
                <DropDown
                  contents={tokenList}
                  selectContentState={selectedToken}
                  setSelectContentState={setSelectedToken}
                  iconKey="logoUrl"
                  nameKey="name"
                  size="small"
                ></DropDown>
              </PaymasterDropDownWrapper> */}
            </PaymasterWrapper>
          )}
          <EstimatedGasBoxWrapper>
            <EstimatedGasTextWrapper>
              <Text size="body2" color="bg40">
                Estimated GAS
              </Text>
              <Icon type="gas" color="bg40" height="title3"></Icon>
            </EstimatedGasTextWrapper>
            <Text $thin>0.000000001</Text>
          </EstimatedGasBoxWrapper>
        </GasWrapper>

        <Button
          text={isTransactionLoading ? 'Transaction In Progress...' : 'send'}
          size="large"
          type="primary"
          disabled={checkDisable()}
          onClick={handleSubmit}
        />
      </TransferWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

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
  width: 60%;
`;

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
