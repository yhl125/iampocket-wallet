'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { isAddress } from 'viem';
import styled from 'styled-components';

import theme from '@/styles/theme';
import Text from '../commons/Text';
import Input from '../commons/Input';

interface Props {
  setIsVerifiedAddress: Dispatch<SetStateAction<boolean>>;
  setRecipientAddressOrEns: Dispatch<SetStateAction<string>>;
}

function SearchRecipientAddress({
  setIsVerifiedAddress,
  setRecipientAddressOrEns,
}: Props) {
  const [recipientAddress, setRecipientAddress] = useState<string>('');

  const checkRecipientAddress = (recipientAddress: string): boolean => {
    if (recipientAddress != '') {
      const isAddressVerified = isAddress(recipientAddress);
      setRecipientAddress(recipientAddress);
      return isAddressVerified;
    } else return false;
  };

  return (
    <Container>
      <Text size="title3" color="bg40">
        To
      </Text>
      <Input
        value={recipientAddress}
        onChange={(e: any) => {
          setIsVerifiedAddress(checkRecipientAddress(e.target.value));
          setRecipientAddressOrEns(e.target.value);
        }}
        size="medium"
        type="text"
        placeholder="Address(0x),ENS"
      />
    </Container>
  );
}

const Container = styled.div`
  gap: ${theme.space.xTiny};
`;

export default SearchRecipientAddress;
