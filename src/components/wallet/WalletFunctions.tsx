'use client';

import styled from 'styled-components';
import SwapIcon from '@/assets/icons/wallet/swap.svg';
import DepositIcon from '@/assets/icons/wallet/plus.svg';
import BridgeIcon from '@/assets/icons/wallet/bridge.svg';
import SendIcon from '@/assets/icons/wallet/send.svg';

import Text from '../commons/Text';
import theme from '@/styles/theme';
import Link from 'next/link';

const WALLET_FUNCTIONS = [
  {
    title: 'Send',
    icon: <SendIcon />,
    link: '/transfer',
  },
  {
    title: 'Deposit',
    icon: <DepositIcon />,
    // TODO: replace to modal
    link: '/deposit',
  },
  {
    title: 'Swap',
    icon: <SwapIcon />,
    link: '/swap',
  },
  {
    title: 'Bridge',
    icon: <BridgeIcon />,
    link: '/bridge',
  },
];

function WalletFunctions() {
  return (
    <Container>
      <Contents>
        {WALLET_FUNCTIONS.map((item) => {
          return (
            <Link href={item.link}>
              <FunctionItem>
                <CircularButton>{item.icon}</CircularButton>
                <Text size="body3">{item.title}</Text>
              </FunctionItem>
            </Link>
          );
        })}
      </Contents>
    </Container>
  );
}

const Container = styled.div`
  max-width: 395px;
  width: 100%;
`;
const Contents = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FunctionItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: ${theme.space.tiny};
`;
const CircularButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${theme.color.brandBlue50};

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${theme.color.brandBlue60};
  }
`;

export default WalletFunctions;
