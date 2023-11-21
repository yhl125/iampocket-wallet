import PKPStore from '@/store/PKPStore';
import { useCallback, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import Text from '@/components/commons/Text';
import { Circuit } from '@/utils/lit-listener';
import styled from 'styled-components';
import theme from '@/styles/theme';

export default function CircuitLogs() {
  const { currentPKP } = useSnapshot(PKPStore.state);
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
        <TitleWrapper>
          <Text>id: {circuit._id}</Text>
          <Text>name: {circuit.name}</Text>
          <Text>description: {circuit.description}</Text>
          <Text>type: {circuit.type}</Text>
        </TitleWrapper>
        {circuit.transactionLogs.map((log) => {
          return (
            <TitleWrapper key={log.transactionHash}>
              <Text>transactionHash: {log.transactionHash}</Text>
              <Text>date: {log.isoDate}</Text>
            </TitleWrapper>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div>
        <Text>Running circuits: {runningCircuitCount}</Text>
        <div>
          {runningCircuits.map((circuit) => circuitToComponent(circuit))}
        </div>
      </div>
      <div>
        <Text>Stopped circuits: {stoppedCircuitCount}</Text>
        <div>
          {stoppedCircuits.map((circuit) => circuitToComponent(circuit))}
        </div>
      </div>
      <div>
        <Text>
          Server-down-stopped circuits: {serverDownStoppedCircuitCount}
        </Text>
        <div>
          {serverDownStoppedCircuits.map((circuit) =>
            circuitToComponent(circuit),
          )}
        </div>
      </div>
    </div>
  );
}

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${theme.space.xSmall};
`;
