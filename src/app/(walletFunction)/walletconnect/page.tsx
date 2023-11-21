'use client';

import { LoadingSmall } from '@/components/Loading';
import Modal from '@/components/walletconnect-modal/Modal';
import { web3wallet } from '@/utils/WalletConnectUtil';
import { SetStateAction, useState } from 'react';
import QrHandler from '@/components/walletconnect/QrHandler';
import useWalletWithPKP from '@/hooks/useWalletWithPKP';
import Input from '@/components/commons/Input';
import Button from '@/components/commons/Button';
import IconTextButton from '@/components/commons/IconTextButton';
import Text from '@/components/commons/Text';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import theme from '@/styles/theme';

function WalletConnectPage() {
  const router = useRouter();
  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);

  async function onConnect(uri: string) {
    try {
      setLoading(true);

      await web3wallet.pair({ uri });
    } catch (err: unknown) {
      alert(err);
    } finally {
      setUri('');
      setLoading(false);
    }
  }

  useWalletWithPKP();

  return (
    <>
      <Container>
        <Text size="title1" $bold>
          WalletConnect
        </Text>

        <WalletConnectWrapper>
          <WalletConnectInputWrapper>
            <TextWrapper>
              <Text size="title3" color="bg40">
                Enter WalletConnect URI
              </Text>
            </TextWrapper>
            <Input
              value={uri}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setUri(e.target.value)
              }
              size="medium"
              type="text"
              placeholder="e.g. wc:a281567bb3e4..."
            />
          </WalletConnectInputWrapper>
          <Button
            text={!uri ? 'Enter URI' : loading ? 'Connecting...' : 'Connect'}
            size="large"
            type="primary"
            onClick={() => onConnect(uri)}
            disabled={!uri}
          />
        </WalletConnectWrapper>
        <ButtonWrapper>
          <IconTextButton
            text="Back"
            size="small"
            icon="leftarrow"
            onClick={() => router.back()}
          />
        </ButtonWrapper>
      </Container>
      <Modal />
    </>
  );
}

const Container = styled.div`
  row-gap: ${theme.space.large};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TextWrapper = styled.div``;

const WalletConnectWrapper = styled.div`
  row-gap: ${theme.space.medium};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const WalletConnectInputWrapper = styled.div`
  gap: ${theme.space.xTiny};

  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div``;

export default WalletConnectPage;
