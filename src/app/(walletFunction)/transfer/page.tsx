'use client';

import { useRouter } from 'next/navigation';
import TransferTokenForm from '@/components/transfer/TransferTokenForm';
import Text from '../../../components/commons/Text';
import IconTextButton from '../../../components/commons/IconTextButton';
import styled from 'styled-components';
import theme from '@/styles/theme';
import { useIsMounted } from '@/hooks/useIsMounted';

function TransferToken() {
  const router = useRouter();
  const mounted = useIsMounted();
  return (
    <Container>
      <Text size="title1" $bold>
        Send
      </Text>
      {mounted && <TransferTokenForm />}
      <ButtonWrapper>
        <IconTextButton
          text="Back"
          size="small"
          icon="leftArrow"
          onClick={() => router.back()}
        />
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  row-gap: ${theme.space.large};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonWrapper = styled.div``;

export default TransferToken;
