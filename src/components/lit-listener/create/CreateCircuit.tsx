import PKPStore from '@/store/PKPStore';
import { projectIdOf } from '@/utils/ClientUtil';
import {
  IViemTransactionAction,
  IWebhookCondition,
  IZeroDevUserOperationAction,
} from '@lit-listener-sdk/types';
import { ChangeEvent, useState } from 'react';
import { useSnapshot } from 'valtio';

export default function CreateCircuit() {
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  const serverUrl =
    process.env.NEXT_PUBLIC_LIT_LISTENER_SERVER_URL || 'http://localhost:3001/';
  const [type, setType] = useState('Viem');
  const [circuitName, setCircuitName] = useState('');
  const [circuitDescription, setCircuitDescription] = useState('');
  const [coingeckoToken, setCoingeckoToken] = useState('ethereum');
  const [matchOperator, setMatchOperator] = useState('>');
  const [conditionValue, setConditionValue] = useState(0);
  const [conditionInterval, setConditionInterval] = useState(0);
  const [action, setAction] = useState('transfer');
  const [actionChainId, setActionChainId] = useState(80001);
  const [actionValue, setActionValue] = useState(0);
  const [maxActionRun, setMaxActionRun] = useState(0);
  const [transferToken, setTransferToken] = useState('Ethereum');
  const [swapFromToken, setSwapFromToken] = useState('Ethereum');
  const [swapToToken, setSwapToToken] = useState('Ethereum');

  function setConditionMatchOperator(matchOperator: 'Above' | 'Below') {
    if (matchOperator === 'Above') {
      setMatchOperator('>');
    } else {
      setMatchOperator('<');
    }
  }

  function createCircuit() {
    console.log('type', type);
    console.log('circuitName', circuitName);
    console.log('circuitDescription', circuitDescription);
    console.log('coingeckoToken', coingeckoToken);
    console.log('matchOperator', matchOperator);
    console.log('coingeckoTokenValue', conditionValue);
    console.log('conditionInterval', conditionInterval);
    console.log('action', action);
    console.log('actionChainId', actionChainId);
    console.log('actionValue', actionValue);
    console.log('maxActionRun', maxActionRun);
    console.log('transferToken', transferToken);
    console.log('swapFromToken', swapFromToken);
    console.log('swapToToken', swapToToken);
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
                placeholder="e.g., 100"
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
                placeholder="e.g., 100"
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
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="transfer">Transfer</option>
                <option value="swap">Swap</option>
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
                defaultValue="80001"
                onChange={(e) => setActionChainId(parseInt(e.target.value))}
              />
              {action === 'transfer' && (
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
                    placeholder="token address"
                    onChange={(e) => setTransferToken(e.target.value)}
                  />
                </>
              )}
              {action === 'swap' && (
                <>
                  <label
                    htmlFor="fromToken"
                    className="block text-sm font-medium text-gray-700"
                  >
                    From Token
                  </label>
                  <select
                    id="fromToken"
                    name="fromToken"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) => setSwapFromToken(e.target.value)}
                  >
                    <option>Ethereum</option>
                    <option>Bitcoin</option>
                  </select>
                  <label
                    htmlFor="toToken"
                    className="mt-4 block text-sm font-medium text-gray-700"
                  >
                    To Token
                  </label>
                  <select
                    id="toToken"
                    name="toToken"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) => setSwapToToken(e.target.value)}
                  >
                    <option>Ethereum</option>
                    <option>Bitcoin</option>
                  </select>
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
                placeholder="e.g., 100"
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
                placeholder="Max number of runs"
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
