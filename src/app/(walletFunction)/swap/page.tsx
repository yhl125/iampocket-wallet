'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import Text from '@/components/commons/Text';
import IconTextButton from '@/components/commons/IconTextButton';
import SwapForm from '@/components/swap/SwapForm';
import theme from '@/styles/theme';
import { useIsMounted } from '@/hooks/useIsMounted';

function Swap() {
  const mounted = useIsMounted();

  const router = useRouter();
  return (
    <>
      {mounted && (
        <Container>
          <Text size="title1" $bold>
            Swap
          </Text>
          <SwapForm />
          <ButtonWrapper>
            <IconTextButton
              text="Back"
              size="small"
              icon="leftArrow"
              onClick={() => router.push('/wallet')}
            />
          </ButtonWrapper>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  row-gap: ${theme.space.large};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonWrapper = styled.div``;

export default Swap;
