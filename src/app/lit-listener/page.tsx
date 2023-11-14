'use client';

import PKPStore from '@/store/PKPStore';
import { projectIdOf } from '@/utils/ClientUtil';
import {
  IViemTransactionAction,
  IWebhookCondition,
  IZeroDevUserOperationAction,
} from '@lit-listener-sdk/types';
import { useSnapshot } from 'valtio';

function LitListenerPage() {
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  const serverUrl =
    process.env.NEXT_PUBLIC_LIT_LISTENER_SERVER_URL || 'http://localhost:3001/';

  function viemCircuit() {
    const transactionAction: IViemTransactionAction = {
      chain: {
        chainId: 80001,
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
      projectId: projectIdOf(80001),
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
      <button onClick={viemCircuit} className="btn btn-primary">
        Viem circuit
      </button>
      <button onClick={zeroDevCircuit} className="btn btn-primary">
        ZeroDev circuit
      </button>
    </>
  );
}
export default LitListenerPage;
