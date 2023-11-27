import PKPStore from '@/store/PKPStore';
import { projectIdOf } from '@/utils/ClientUtil';
import {
  IViemTransactionAction,
  IWebhookCondition,
  IZeroDevUserOperationAction,
} from '@lit-listener-sdk/types';
import { useState } from 'react';
import { useSnapshot } from 'valtio';
import Input from '../commons/Input';
import { useRouter } from 'next/navigation';
import SelectChainDropDown from '../commons/SelectChainDropDown';
import Button from '../commons/Button';
import theme from '@/styles/theme';
import styled from 'styled-components';

export default function CreateCircuit() {
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  const serverUrl =
    process.env.NEXT_PUBLIC_LIT_LISTENER_SERVER_URL || 'http://localhost:3001/';
  const [chainId, setChainId] = useState(80001);
  const router = useRouter();

  function viemCircuit() {
    const transactionAction: IViemTransactionAction = {
      chain: {
        chainId: chainId,
        customChain: false,
      },
      transport: {
        type: 'http',
      },
      to: '0x0000000000000000000000000000000000000000',
      value: 100,
      type: 'viem',
    };

    const webhookCondition: IWebhookCondition = {
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      responsePath: 'ethereum.usd',
      expectedValue: 1600,
      matchOperator: '>',
      interval: 10000,
      type: 'webhook',
    };

    const body = {
      name: 'string',
      description: 'string',
      litNetwork: 'cayenne',
      pkpPubKey: currentPKP!.publicKey,
      conditions: [webhookCondition],
      conditionalLogic: { type: 'EVERY' },
      options: { maxLitActionCompletions: 2 },
      actions: [transactionAction],
      sessionSigs: sessionSigs,
    };

    fetch(serverUrl + 'circuit-viem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  function zeroDevCircuit() {
    const transactionAction: IZeroDevUserOperationAction = {
      projectId: projectIdOf(chainId),
      userOp: {
        target: '0x0000000000000000000000000000000000000000',
        data: '0x',
        value: 100,
      },
      type: 'zerodev',
    };

    const webhookCondition: IWebhookCondition = {
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      responsePath: 'ethereum.usd',
      expectedValue: 1600,
      matchOperator: '>',
      interval: 10000,
      type: 'webhook',
    };

    fetch(serverUrl + 'circuit-zerodev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'string',
        description: 'string',
        litNetwork: 'cayenne',
        pkpPubKey: currentPKP!.publicKey,
        conditions: [webhookCondition],
        conditionalLogic: { type: 'EVERY' },
        options: { maxLitActionCompletions: 2 },
        actions: [transactionAction],
        sessionSigs: sessionSigs,
      }),
    });
  }

  return (
    <Container>
      <SelectChainDropDown setChainId={setChainId} />
      <ButtonWrapper>
        <Button
          text="Viem circuit"
          size="medium"
          type="primary"
          onClick={viemCircuit}
        />

        <Button
          text="ZeroDev circuit"
          size="medium"
          type="primary"
          onClick={zeroDevCircuit}
        />

        <Button
          text="Custom circuit"
          size="medium"
          type="primary"
          onClick={() => router.push('/lit-listener/create')}
        />
      </ButtonWrapper>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  row-gap: ${theme.space.small};
`;

const ButtonWrapper = styled.div`
  display: flex;

  width: 100%;
  gap: ${theme.space.xTiny};
`;
