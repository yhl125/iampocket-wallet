'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import BridgeForm from '@/components/bridge/BridgeForm';
import Text from '../../../components/commons/Text';
import IconTextButton from '../../../components/commons/IconTextButton';
import theme from '@/styles/theme';
import { useIsMounted } from '@/hooks/useIsMounted';

function Bridge() {
  const router = useRouter();
  const mounted = useIsMounted();
  return (
    <Container>
      <Text size="title1" $bold>
        Bridge
      </Text>
      {mounted && <BridgeForm />}
      <ButtonWrapper>
        <IconTextButton
          text="Back"
          size="small"
          icon="leftArrow"
          onClick={() => router.push('/wallet')}
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

export default Bridge;
