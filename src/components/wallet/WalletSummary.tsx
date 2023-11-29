'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { toast } from 'react-toastify';

import WalletConnectIcon from '@/assets/icons/walletconnect.svg';
import theme from '@/styles/theme';
import { setComma, truncateAddress } from '@/utils/HelperUtil';
import CopyIcon from '@/assets/icons/copy.svg';
import Text from '../commons/Text';

interface IProps {
  userAddress: string;
  totalBalance: number;
}
function WalletSummary({ userAddress, totalBalance }: IProps) {
  const handleCopyAddressButton = () => {
    // TODO: add alert component
    navigator.clipboard.writeText(userAddress);
    toast.success('copied to clipboard!');
  };
  return (
    <Container>
      <Title>
        <Text size="display" $bold>
          Wallet
        </Text>
        <Link href="/walletconnect">
          <WalletConnectIcon />
        </Link>
      </Title>
      <Address>
        <Text size="body2" color="bg30">
          {truncateAddress(userAddress)}
        </Text>
        <CopyIconButton onClick={handleCopyAddressButton}>
          <CopyIcon />
        </CopyIconButton>
      </Address>
      <TotalAsset>
        <Text size="display">{totalBalance}</Text>
      </TotalAsset>
    </Container>
  );
}

const Container = styled.div``;
const Title = styled.div`
  display: flex;
  align-items: center;
  column-gap: ${theme.space.tiny};
  margin-bottom: ${theme.space.tiny};
`;
const Address = styled.div`
  display: flex;
  align-items: center;
  column-gap: ${theme.space.xTiny};
  margin-bottom: ${theme.space.base};
`;
const CopyIconButton = styled.button`
  svg {
    width: 20px;
    height: 20px;
  }
  &:hover {
    path {
      fill: ${theme.color.bg0};
    }
  }
`;
const TotalAsset = styled.div`
  margin-bottom: ${theme.space.base};
`;

export default WalletSummary;
