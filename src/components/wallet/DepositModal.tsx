'use client';

import QRCode from 'react-qr-code';
import styled from 'styled-components';
import { useSnapshot } from 'valtio';

import theme from '@/styles/theme';
import Text from '../commons/Text';
import CloseIcon from '@/assets/icons/clear.svg';
import ModalStore from '@/store/ModalStore';
import AddressStore, { selectedWalletType } from '@/store/AddressStore';

function DepositModal() {
  const { zeroDevAddress, pkpViemAddress, selectedWallet } = useSnapshot(
    AddressStore.state,
  );
  function getCurrentAddress(selectedWallet: selectedWalletType) {
    if (selectedWallet === 'zeroDev') return zeroDevAddress;
    else if (selectedWallet === 'pkpViem') return pkpViemAddress;
    else return zeroDevAddress;
  }

  return (
    <Container>
      <Header>
        <Text size="title3" $bold>
          Deposit
        </Text>
        <CloseButton
          onClick={() => {
            ModalStore.close();
          }}
        >
          <CloseIcon />
        </CloseButton>
      </Header>

      <Content>
        <QrCodeWrapper>
          <QRCode
            value={getCurrentAddress(selectedWallet)}
            style={{ height: 'auto', maxWidth: '200px', width: '100%' }}
          />
        </QrCodeWrapper>
        <Text size="body2" color="bg30">
          Please scan your wallet address
        </Text>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  max-width: 500px;
  width: calc(100% - 40px);
  background-color: ${theme.color.bg80};
  padding: ${theme.space.base};
  border-radius: 10px;
`;
const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: ${theme.space.base};
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CloseButton = styled.button`
  svg {
    path {
      fill: ${theme.color.bg0};
    }
  }

  &:hover {
    svg {
      path {
        fill: ${theme.color.bg20};
      }
    }
  }
`;
const QrCodeWrapper = styled.div`
  padding: ${theme.space.tiny};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.color.bg0};
  border-radius: ${theme.space.xTiny};

  margin-bottom: ${theme.space.base};
`;

export default DepositModal;
