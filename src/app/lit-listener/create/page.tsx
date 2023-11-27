'use client'

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import CreateCustomCircuit from '@/components/lit-listener/create/CreateCustomCircuit';
import theme from '@/styles/theme';
import Text from '@/components/commons/Text';
import IconTextButton from '@/components/commons/IconTextButton';

function LitListenerCreatePage() {
  const router = useRouter();
  return (
    <>
     <Container>
        <Text size="title1" $bold>
        Create Circuit
        </Text>

        <CreateCustomCircuit />

        <ButtonWrapper>
        <IconTextButton
          text="Back"
          size="small"
          icon="leftArrow"
          onClick={() => router.back()}
        />
      </ButtonWrapper>
      </Container>
  
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
export default LitListenerCreatePage;

