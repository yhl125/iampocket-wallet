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

export default function CreateCircuit() {
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  const serverUrl =
    process.env.NEXT_PUBLIC_LIT_LISTENER_SERVER_URL || 'http://localhost:3001/';
  const [chainId, setChainId] = useState(80001);

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
    <>
      <Input
        value={chainId.toString()}
        onChange={(e) => setChainId(parseInt(e.target.value))}
        size="medium"
        placeholder="Chain ID"
      />
      <button onClick={viemCircuit} className="btn btn-primary">
        Viem circuit
      </button>
      <button onClick={zeroDevCircuit} className="btn btn-primary">
        ZeroDev circuit
      </button>
    </>
  );
}
