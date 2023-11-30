'use client';

import CreateCircuit from '@/components/lit-listener/CreateCircuit';
import CircuitLogs from '@/components/lit-listener/CircuitLogs';

import Text from '@/components/commons/Text';
import styled from 'styled-components';
import theme from '@/styles/theme';
import { useIsMounted } from '@/hooks/useIsMounted';
function LitListenerPage() {
  const mounted = useIsMounted();
  return (
    <>
      <Container>
        <Text size="title1" $bold>
          Circuit
        </Text>
        
        {mounted && <CreateCircuit />}
        <CircuitLogs />
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

export default LitListenerPage;
