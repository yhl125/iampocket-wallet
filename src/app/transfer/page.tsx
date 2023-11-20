'use client';

import { useRouter } from 'next/navigation';
import TransferTokenForm from '@/components/transfer/TransferTokenForm';
import Text from '../../components/commons/Text';
import Input from '../../components/commons/Input';
import Button from '../../components/commons/Button';
import IconTextButton from '../../components/commons/IconTextButton';
import styled from 'styled-components';
import theme from '@/styles/theme';

function TransferToken() {
  const router = useRouter();
  return (
    <Container>
      <Text size="title1" $bold>
        Send
      </Text>

      <TransferTokenForm></TransferTokenForm>

      <ButtonWrapper>
        <IconTextButton
          text="Back"
          size="small"
          icon="leftarrow"
          onClick={() => router.back()}
        />
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.large};
  width: 600px;
`;

const ButtonWrapper = styled.div``;
export default TransferToken;
