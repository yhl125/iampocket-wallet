import PKPStore from '@/store/PKPStore';
import { useCallback, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import Text from '@/components/commons/Text';
import { Circuit } from '@/utils/lit-listener';
import styled from 'styled-components';
import theme from '@/styles/theme';
import { AuthSig, SessionSigs } from '@lit-protocol/types';
import Button from '../commons/Button';

export default function CircuitLogs() {
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  const serverUrl =
    process.env.NEXT_PUBLIC_LIT_LISTENER_SERVER_URL || 'http://localhost:3001/';

  type CircuitStatus = 'running' | 'stopped' | 'server-down-stopped';
  const [runningCircuitCount, setRunningCircuitCount] = useState(0);
  const [stoppedCircuitCount, setStoppedCircuitCount] = useState(0);
  const [serverDownStoppedCircuitCount, setServerDownStoppedCircuitCount] =
    useState(0);
  const [runningCircuits, setRunningCircuits] = useState<Circuit[]>([]);
  const [stoppedCircuits, setStoppedCircuits] = useState<Circuit[]>([]);
  const [serverDownStoppedCircuits, setServerDownStoppedCircuits] = useState<
    Circuit[]
  >([]);

  const countByStatus = useCallback(
    async (status: CircuitStatus) => {
      const params = `${status}/${currentPKP?.publicKey}`;
      const response = await fetch(
        serverUrl + 'circuit/pkp-pub-key/count/' + params,
        {
          method: 'GET',
        },
      );
      return response.json();
    },
    [currentPKP?.publicKey, serverUrl],
  );

  const getByStatus = useCallback(
    async (status: CircuitStatus) => {
      const params = `${status}/${currentPKP?.publicKey}`;
      const response = await fetch(
        serverUrl + 'circuit/pkp-pub-key/' + params,
        {
          method: 'GET',
        },
      );
      return response.json();
    },
    [currentPKP?.publicKey, serverUrl],
  );

  useEffect(() => {
    const fetchData = async () => {
      const runningCount = await countByStatus('running');
      const runningCircuitsData = await getByStatus('running');
      const stoppedCount = await countByStatus('stopped');
      const stoppedCircuitsData = await getByStatus('stopped');
      const serverDownStoppedCount = await countByStatus('server-down-stopped');
      const serverDownStoppedCircuitsData = await getByStatus(
        'server-down-stopped',
      );

      setRunningCircuitCount(runningCount);
      setRunningCircuits(runningCircuitsData);
      setStoppedCircuitCount(stoppedCount);
      setStoppedCircuits(stoppedCircuitsData);
      setServerDownStoppedCircuitCount(serverDownStoppedCount);
      setServerDownStoppedCircuits(serverDownStoppedCircuitsData);
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); // 5 seconds interval
    return () => clearInterval(interval);
  }, [countByStatus, currentPKP, getByStatus]);

  function circuitToComponent(circuit: Circuit) {
    return (
      <div key={circuit._id}>
        <ProgressWrapper>
          <Text size="title3" $bold>
            Circuit
          </Text>
          <DetailWrapper>
            <Text size="body4" color="bg20">
              ID
            </Text>
            <Text $thin> {circuit._id}</Text>
          </DetailWrapper>
          <DetailWrapper>
            <Text size="body4" color="bg20">
              Name
            </Text>
            <Text>{circuit.name}</Text>
          </DetailWrapper>
          <DetailWrapper>
            <Text size="body4" color="bg20">
              Description
            </Text>
            <Text>{circuit.description}</Text>
          </DetailWrapper>
          <DetailWrapper>
            <Text size="body4" color="bg20">
              Type
            </Text>
            <Text>{circuit.type}</Text>
          </DetailWrapper>
        </ProgressWrapper>
        {circuit.transactionLogs.map((log) => {
          return (
            <ResultWrapper key={log.transactionHash}>
              <Text size="title3" $bold>
                TX Result
              </Text>
              <DetailWrapper>
                <Text size="body3" color="bg20">
                  TransactionHash
                </Text>
                <Text>{log.transactionHash}</Text>{' '}
              </DetailWrapper>
              <DetailWrapper>
                <Text size="body3" color="bg20">
                  Date
                </Text>
                <Text> {log.isoDate}</Text>
              </DetailWrapper>
            </ResultWrapper>
          );
        })}
      </div>
    );
  }

  function runningCircuitToComponent(circuit: Circuit) {
    return (
      <div key={circuit._id}>
        <ProgressWrapper>
          <Text size="title3" $bold>
            Circuit
          </Text>
          <DetailWrapper>
            <Text size="body4" color="bg20">
              ID
            </Text>
            <Text $thin> {circuit._id}</Text>
          </DetailWrapper>
          <DetailWrapper>
            <Text size="body4" color="bg20">
              Name
            </Text>
            <Text>{circuit.name}</Text>
          </DetailWrapper>
          <DetailWrapper>
            <Text size="body4" color="bg20">
              Description
            </Text>
            <Text>{circuit.description}</Text>
          </DetailWrapper>
          <DetailWrapper>
            <Text size="body4" color="bg20">
              Type
            </Text>
            <Text>{circuit.type}</Text>
          </DetailWrapper>
        </ProgressWrapper>
        {circuit.transactionLogs.map((log) => {
          return (
            <ResultWrapper key={log.transactionHash}>
              <Text size="title3" $bold>
                TX Result
              </Text>
              <DetailWrapper>
                <Text size="body3" color="bg20">
                  TransactionHash
                </Text>
                <Text>{log.transactionHash}</Text>{' '}
              </DetailWrapper>
              <DetailWrapper>
                <Text size="body3" color="bg20">
                  Date
                </Text>
                <Text> {log.isoDate}</Text>
              </DetailWrapper>
            </ResultWrapper>
          );
        })}

        <Button
          text="STOP"
          size="large"
          type="primary"
          onClick={() => stopCircuit(circuit._id, circuit.type)}
        />
      </div>
    );
  }

  interface ValidateCircuitDto {
    authSig?: AuthSig;
    sessionSigs?: SessionSigs;
  }

  function stopCircuit(circuitId: string, type: 'viem' | 'zerodev') {
    const body: ValidateCircuitDto = {
      sessionSigs: sessionSigs,
    };
    if (type === 'viem') {
      fetch(serverUrl + 'circuit-viem/stop/' + circuitId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } else if (type === 'zerodev') {
      fetch(serverUrl + 'circuit-zerodev/stop/' + circuitId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    }
  }

  return (
    <Container>
      <CircuitBox>
        <Text size="title3" $bold>
          Running circuits: {runningCircuitCount}
        </Text>
        <CircuitWrapper>
          {runningCircuits.map((circuit) => runningCircuitToComponent(circuit))}
        </CircuitWrapper>
      </CircuitBox>
      <CircuitBox>
        <Text size="title3" $bold>
          Stopped circuits: {stoppedCircuitCount}
        </Text>
        <CircuitWrapper>
          {stoppedCircuits.map((circuit) => circuitToComponent(circuit))}
        </CircuitWrapper>
      </CircuitBox>
      <CircuitBox>
        <Text size="title3" $bold>
          Server-down-stopped circuits: {serverDownStoppedCircuitCount}
        </Text>
        <CircuitWrapper>
          {serverDownStoppedCircuits.map((circuit) =>
            circuitToComponent(circuit),
          )}
        </CircuitWrapper>
      </CircuitBox>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const CircuitBox = styled.div`
  display: flex;
  width: 33%;
  height: 600px;
  border: 1px solid ${theme.color.bg40};
  border-radius: 5px;
  flex-direction: column;
  padding: ${theme.space.base};
  row-gap: ${theme.space.base};
  overflow-y: auto;
`;

const CircuitWrapper = styled.div``;

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  word-break: break-all;
  padding: ${theme.space.small};
  border: 1px solid ${theme.color.bg40};
  margin-bottom: ${theme.space.xSmall};
  border-radius: 5px;
  row-gap: ${theme.space.xSmall};
`;

const ResultWrapper = styled(ProgressWrapper)`
  border: none;
  background-color: ${theme.color.bg80};
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
