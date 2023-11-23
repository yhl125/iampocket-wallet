import { ERC20_ABI } from '@/abi/abi';
import PKPStore from '@/store/PKPStore';
import { projectIdOf } from '@/utils/ClientUtil';
import {
  IFetchActionViemTransaction,
  IFetchActionZeroDevUserOperation,
  IViemTransactionAction,
  IWebhookCondition,
  IZeroDevUserOperationAction,
} from '@lit-listener-sdk/types';
import { set } from 'lodash';
import { ChangeEvent, useState } from 'react';
import { useSnapshot } from 'valtio';
import { Address, encodeFunctionData } from 'viem';

export default function CreateCircuit() {
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  const serverUrl =
    process.env.NEXT_PUBLIC_LIT_LISTENER_SERVER_URL || 'http://localhost:3001/';
  const [type, setType] = useState('Viem');
  const [circuitName, setCircuitName] = useState('');
  const [circuitDescription, setCircuitDescription] = useState('');
  const [coingeckoToken, setCoingeckoToken] = useState('ethereum');
  const [matchOperator, setMatchOperator] = useState<'<' | '>'>('>');
  const [conditionValue, setConditionValue] = useState(0);
  const [conditionInterval, setConditionInterval] = useState(0);
  const [actionType, setActionType] = useState('transfer');
  const [actionChainId, setActionChainId] = useState(80001);
  const [actionValue, setActionValue] = useState(0);
  const [maxActionRun, setMaxActionRun] = useState(0);
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
    if (type === 'Viem') {
      createViemCircuit();
    } else {
      createZeroDevCircuit();
    }
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
      <body className="bg-white text-gray-800">
        <div className="mx-auto max-w-4xl p-5">
          <h1 className="mb-6 text-2xl font-bold">Create Circuit Page</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="circuitType"
                className="block text-sm font-medium text-gray-700"
              >
                Circuit Type
              </label>
              <select
                id="circuitType"
                name="circuitType"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setType(e.target.value)}
              >
                <option>ZeroDev</option>
                <option>Viem</option>
              </select>
              <label
                htmlFor="name"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Circuit Name"
                onChange={(e) => setCircuitName(e.target.value)}
              />
              <label
                htmlFor="description"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Circuit Description"
                onChange={(e) => setCircuitDescription(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="condition"
                className="block text-sm font-medium text-gray-700"
              >
                Condition
              </label>
              <label
                htmlFor="conditionPosition"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Coingecko Price
              </label>
              <select
                id="condition"
                name="condition"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setCoingeckoToken(e.target.value)}
              >
                <option value={'ethereum'}>Ethereum</option>
                <option value={'bitcoin'}>Bitcoin</option>
              </select>
              <label
                htmlFor="conditionPosition"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Position
              </label>
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
              <label
                htmlFor="conditionValue"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Value
              </label>
              <input
                type="text"
                id="conditionValue"
                name="conditionValue"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue={10000}
                onChange={(e) => setConditionValue(parseInt(e.target.value))}
              />
              <label
                htmlFor="conditionInterval"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Interval (ms)
              </label>
              <input
                type="text"
                id="conditionInterval"
                name="conditionInterval"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue={10000}
                onChange={(e) => setConditionInterval(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label
                htmlFor="action"
                className="block text-sm font-medium text-gray-700"
              >
                Action
              </label>
              <select
                id="action"
                name="action"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setActionTypeAndChainId(e.target.value)}
              >
                <option value="transfer">Transfer</option>
                <option value="wrap eth">Goerli Wrap eth</option>
              </select>
              <label
                htmlFor="actionChainId"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Chain ID
              </label>
              <input
                type="text"
                id="actionChainId"
                name="actionChainId"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={actionChainId}
                onChange={(e) => setActionChainId(parseInt(e.target.value))}
              />
              {actionType === 'transfer' && (
                <>
                  <label
                    htmlFor="tokenInput"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Token address
                  </label>
                  <input
                    type="text"
                    id="tokenInput"
                    name="tokenInput"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="0x0000000000000000000000000000000000000000"
                    onChange={(e) =>
                      setTransferToken(e.target.value as Address)
                    }
                  />
                  <label
                    htmlFor="toInput"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Send To
                  </label>
                  <input
                    type="text"
                    id="toInput"
                    name="toInput"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="0x0000000000000000000000000000000000000000"
                    onChange={(e) => setTransferTo(e.target.value as Address)}
                  />
                </>
              )}
              <label
                htmlFor="valueInput"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Value
              </label>
              <input
                type="text"
                id="valueInput"
                name="valueInput"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue={10000}
                onChange={(e) => setActionValue(parseInt(e.target.value))}
              />
              <label
                htmlFor="maxActionRun"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Max Action Run
              </label>
              <input
                type="text"
                id="maxActionRun"
                name="maxActionRun"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue={2}
                onChange={(e) => setMaxActionRun(parseInt(e.target.value))}
              />
            </div>
          </div>
          <button
            className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            onClick={createCircuit}
          >
            Create Circuit
          </button>
        </div>
      </body>
    </>
  );
}
