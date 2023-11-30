import { ERC20_ABI } from '@/abi/abi';
import Button from '@/components/commons/Button';
import PKPStore from '@/store/PKPStore';
import theme from '@/styles/theme';
import { projectIdOf } from '@/utils/ClientUtil';
import {
  IFetchActionViemTransaction,
  IFetchActionZeroDevUserOperation,
  IViemTransactionAction,
  IWebhookCondition,
  IZeroDevUserOperationAction,
} from '@lit-listener-sdk/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';
import { useSnapshot } from 'valtio';
import { Address, encodeFunctionData } from 'viem';
import Text from '@/components/commons/Text';
import Input from '@/components/commons/Input';

function CreateCustomCircuit() {
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  const router = useRouter();
  const serverUrl =
    process.env.NEXT_PUBLIC_LIT_LISTENER_SERVER_URL || 'http://localhost:3001/';
  const [type, setType] = useState('ZeroDev');
  const [circuitName, setCircuitName] = useState('');
  const [circuitDescription, setCircuitDescription] = useState('');
  const [coingeckoToken, setCoingeckoToken] = useState('ethereum');
  const [matchOperator, setMatchOperator] = useState<'<' | '>'>('>');
  const [conditionValue, setConditionValue] = useState(1000);
  const [conditionInterval, setConditionInterval] = useState(10000);
  const [actionType, setActionType] = useState('transfer');
  const [actionChainId, setActionChainId] = useState(80001);
  const [actionValue, setActionValue] = useState(100);
  const [maxActionRun, setMaxActionRun] = useState(2);
  const [transferToken, setTransferToken] = useState<Address>(
    '0x0000000000000000000000000000000000000000',
  );
  const [transferTo, setTransferTo] = useState<Address>(
    '0x0000000000000000000000000000000000000000',
  );

  function setActionTypeAndChainId(actionType: string) {
    if (actionType === 'wrap eth') {
      setActionChainId(5);
    }
    setActionType(actionType);
  }

  function setConditionMatchOperator(matchOperator: 'Above' | 'Below') {
    if (matchOperator === 'Above') {
      setMatchOperator('>');
    } else {
      setMatchOperator('<');
    }
  }

  function createCircuit() {
    if (conditionInterval < 1000) {
      throw new Error('Interval must be at least 1 s');
    }
    if (type === 'Viem') {
      createViemCircuit();
    } else {
      createZeroDevCircuit();
    }
    router.back();
  }

  function createViemCircuit() {
    let action: IViemTransactionAction | IFetchActionViemTransaction;
    if (actionType === 'transfer') {
      action = createViemTransferAction();
    } else {
      action = createViemWrapEthAction();
    }

    const webhookCondition: IWebhookCondition = {
      url: `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoToken}&vs_currencies=usd`,
      responsePath: `${coingeckoToken}.usd`,
      expectedValue: conditionValue,
      matchOperator: matchOperator,
      interval: conditionInterval,
      type: 'webhook',
    };

    const body = {
      name: circuitName,
      description: circuitDescription,
      litNetwork: 'cayenne',
      pkpPubKey: currentPKP!.publicKey,
      conditions: [webhookCondition],
      conditionalLogic: { type: 'EVERY' },
      options: { maxLitActionCompletions: maxActionRun },
      actions: [action],
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

  function createViemTransferAction(): IViemTransactionAction {
    if (transferToken === '0x0000000000000000000000000000000000000000') {
      return {
        chain: {
          chainId: actionChainId,
          customChain: false,
        },
        transport: {
          type: 'http',
        },
        to: transferTo,
        value: actionValue,
        type: 'viem',
      };
    } else {
      const erc20TransferFunctionData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [transferTo, actionValue],
      });
      return {
        chain: {
          chainId: actionChainId,
          customChain: false,
        },
        transport: {
          type: 'http',
        },
        to: transferToken,
        data: erc20TransferFunctionData,
        type: 'viem',
      };
    }
  }

  function createViemWrapEthAction(): IFetchActionViemTransaction {
    return {
      chain: {
        chainId: 5,
        customChain: false,
      },
      transport: {
        type: 'http',
      },
      url: `https://goerli.api.0x.org/swap/v1/quote?buyToken=WETH&sellToken=ETH&buyAmount=${actionValue}`,
      init: {
        headers: { '0x-api-key': process.env.NEXT_PUBLIC_0XSWAP_API_KEY! },
      },
      responsePath: '',
      ignoreGas: true,
      type: 'fetch-viem',
    };
  }

  function createZeroDevCircuit() {
    let action: IZeroDevUserOperationAction | IFetchActionZeroDevUserOperation;
    if (actionType === 'transfer') {
      action = createZeroDevTransferAction();
    } else {
      action = createZeroDevWrapEthAction();
    }

    const webhookCondition: IWebhookCondition = {
      url: `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoToken}&vs_currencies=usd`,
      responsePath: `${coingeckoToken}.usd`,
      expectedValue: conditionValue,
      matchOperator: matchOperator,
      interval: conditionInterval,
      type: 'webhook',
    };

    const body = {
      name: circuitName,
      description: circuitDescription,
      litNetwork: 'cayenne',
      pkpPubKey: currentPKP!.publicKey,
      conditions: [webhookCondition],
      conditionalLogic: { type: 'EVERY' },
      options: { maxLitActionCompletions: maxActionRun },
      actions: [action],
      sessionSigs: sessionSigs,
    };

    fetch(serverUrl + 'circuit-zerodev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  function createZeroDevTransferAction(): IZeroDevUserOperationAction {
    if (transferToken === '0x0000000000000000000000000000000000000000') {
      return {
        projectId: projectIdOf(actionChainId),
        userOp: {
          target: transferTo,
          data: '0x',
          value: actionValue,
        },
        type: 'zerodev',
      };
    } else {
      const erc20TransferFunctionData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [transferTo, actionValue],
      });
      return {
        projectId: projectIdOf(actionChainId),
        userOp: {
          target: transferToken,
          data: erc20TransferFunctionData,
        },
        type: 'zerodev',
      };
    }
  }

  function createZeroDevWrapEthAction(): IFetchActionZeroDevUserOperation {
    return {
      projectId: projectIdOf(actionChainId),
      url: `https://goerli.api.0x.org/swap/v1/quote?buyToken=WETH&sellToken=ETH&buyAmount=${actionValue}`,
      init: {
        headers: { '0x-api-key': process.env.NEXT_PUBLIC_0XSWAP_API_KEY! },
      },
      responsePath: '',
      type: 'fetch-zerodev',
    };
  }

  return (
    <>
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <CircuitInputWrapper>
            <Text size="title2" color="bg0">
              Circuit Info
            </Text>

            <DetailWrapper>
              <Text size="body3" color="bg40">
                Circuit Type
              </Text>

              <select
                id="circuitType"
                name="circuitType"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setType(e.target.value)}
              >
                <option>ZeroDev</option>
                <option>Viem</option>
              </select>
            </DetailWrapper>
            <DetailWrapper>
              <Text size="body3" color="bg40">
                Name
              </Text>
              <Input
                value={circuitName}
                type="text"
                size="small"
                placeholder="Circuit Name"
                onChange={(e) => setCircuitName(e.target.value)}
              />
            </DetailWrapper>
            <DetailWrapper>
              <Text size="body3" color="bg40">
                Description
              </Text>
              <Input
                value={circuitDescription}
                type="text"
                size="small"
                placeholder="Circuit Description"
                onChange={(e) => setCircuitDescription(e.target.value)}
              />
            </DetailWrapper>
          </CircuitInputWrapper>
          <CircuitInputWrapper>
            <Text size="title2" color="bg0">
              Condition
            </Text>
            <DetailWrapper>
              <Text size="body3" color="bg40">
                Coingecko Price
              </Text>

              <select
                id="condition"
                name="condition"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setCoingeckoToken(e.target.value)}
              >
                <option value={'ethereum'}>Ethereum</option>
                <option value={'bitcoin'}>Bitcoin</option>
              </select>
            </DetailWrapper>
            <DetailWrapper>
              <Text size="body3" color="bg40">
                Position
              </Text>

              <select
                id="conditionPosition"
                name="conditionPosition"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) =>
                  setConditionMatchOperator(e.target.value as any)
                }
              >
                <option>Above</option>
                <option>Below</option>
              </select>
            </DetailWrapper>
            <DetailWrapper>
              <Text size="body3" color="bg40">
                Value
              </Text>
              <Input
                value={conditionValue}
                type="text"
                size="small"
                onChange={(e) => setConditionValue(parseInt(e.target.value))}
              />
            </DetailWrapper>

            <DetailWrapper>
              <Text size="body3" color="bg40">
                Interval (ms)
              </Text>
              <Input
                value={conditionInterval}
                type="text"
                size="small"
                onChange={(e) => setConditionInterval(parseInt(e.target.value))}
              />
            </DetailWrapper>
          </CircuitInputWrapper>
          <CircuitInputWrapper>
            <Text size="title2" color="bg0">
              Action
            </Text>
            <select
              id="action"
              name="action"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => setActionTypeAndChainId(e.target.value)}
            >
              <option value="transfer">Transfer</option>
              <option value="wrap eth">Goerli Wrap eth</option>
            </select>
            <DetailWrapper>
              <Text size="body3" color="bg40">
                Chain ID
              </Text>
              <Input
                value={actionChainId}
                type="text"
                size="small"
                onChange={(e) => setActionChainId(parseInt(e.target.value))}
              />
            </DetailWrapper>
            {actionType === 'transfer' && (
              <>
                <DetailWrapper>
                  <Text size="body3" color="bg40">
                    Token address
                  </Text>
                  <Input
                    type="text"
                    size="small"
                    value={transferToken}
                    onChange={(e) =>
                      setTransferToken(e.target.value as Address)
                    }
                  />
                </DetailWrapper>

                <DetailWrapper>
                  <Text size="body3" color="bg40">
                    Send To
                  </Text>
                  <Input
                    type="text"
                    size="small"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value as Address)}
                  />
                </DetailWrapper>
              </>
            )}
            <DetailWrapper>
              <Text size="body3" color="bg40">
                Value
              </Text>
              <Input
                type="text"
                size="small"
                value={actionValue}
                onChange={(e) => setActionValue(parseInt(e.target.value))}
              />
            </DetailWrapper>
            <DetailWrapper>
              <Text size="body3" color="bg40">
                Max Action Run
              </Text>
              <Input
                type="text"
                size="small"
                value={maxActionRun}
                onChange={(e) => setMaxActionRun(parseInt(e.target.value))}
              />
            </DetailWrapper>
          </CircuitInputWrapper>
        </div>

        <Button
          text="Create Circuit"
          size="large"
          type="primary"
          onClick={createCircuit}
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  row-gap: ${theme.space.large};
  flex-direction: column;
  display: flex;
  width: 100%;
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.xTiny};
`;

const CircuitInputWrapper = styled.div`
  row-gap: ${theme.space.base};
  flex-direction: column;
  display: flex;
  width: 100%;
`;

export default CreateCustomCircuit;
