import { socket } from '@/hooks/bridge/apis';
import AddressStore from '@/store/AddressStore';
import TokenStore from '@/store/TokenStore';
import { BridgeCurrency, BridgeRoute } from '@/utils/BridgeUtil';
import {
  ChainDetails,
  Path,
  SocketQuote,
  SortOptions,
  Token,
} from '@socket.tech/socket-v2-sdk';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { parseUnits } from 'viem';
import { useDebouncedCallback } from 'use-debounce';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';
import PKPStore from '@/store/PKPStore';
import {
  zeroDevSigner,
  zeroDevSignerWithERC20Gas,
} from '@/utils/ERC4337WalletUtil';
import { createPkpViemWalletClient } from '@/utils/EOAWalletUtil';

export default function BridgeQuote({
  sourceNetwork,
  destNetwork,
  sourceToken,
  destToken,
  sourceTokenList,
  destTokenList,
  sourceNetworkList,
  destNetworkList,
  selectedRoute,
  routes,
  setSourceNetwork,
  setDestNetwork,
  setSourceToken,
  setDestToken,
  setSourceTokenList,
  setDestTokenList,
  setSelectedRoute,
  setRoutes,
}: {
  sourceNetwork: ChainDetails;
  destNetwork: ChainDetails;
  sourceToken: BridgeCurrency;
  destToken: BridgeCurrency;
  sourceTokenList: BridgeCurrency[] | undefined;
  destTokenList: BridgeCurrency[] | undefined;
  sourceNetworkList?: ChainDetails[];
  destNetworkList?: ChainDetails[];
  selectedRoute?: BridgeRoute;
  routes?: BridgeRoute;

  setSourceNetwork: (network: ChainDetails) => void;
  setDestNetwork: (network: ChainDetails) => void;
  setSourceToken: (sourceToken: BridgeCurrency) => void;
  setDestToken: (sourceToken: BridgeCurrency) => void;
  setSourceTokenList: (sourceToken: BridgeCurrency[]) => void;
  setDestTokenList: (sourceToken: BridgeCurrency[]) => void;
  setSelectedRoute: (route: BridgeRoute) => void;
  setRoutes: (route: BridgeRoute) => void;
}) {
  const { tokenList } = useSnapshot(TokenStore.tokenListState);
  const { pkpViemAddress, zeroDevAddress, selectedWallet } = useSnapshot(
    AddressStore.state,
  );

  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  const setDebouncedInputAmount = useDebouncedCallback((inputAmount) => {
    setInputAmount(inputAmount);
  }, 1000);
  const setDebouncedSourceToken = useDebouncedCallback((sourceToken) => {
    setSourceToken(sourceToken);
  }, 500);
  const setDebouncedDestToken = useDebouncedCallback((destToken) => {
    setDestToken(destToken);
  }, 500);
  const [bridgeExecuteStatus, setBridgeExecuteStatus] = useState('');
  const [inputAmount, setInputAmount] = useState('0');
  const [outputAmount, setOutputAmount] = useState('0');
  const [bridgeQuote, setBridgeQuote] = useState<SocketQuote>();
  const [selectedSourceTokenBalance, setSelectedSourceTokenBalance] =
    useState('0');
  const [selectedDestTokenBalance, setSelectedDestTokenBalance] = useState('0');
  const [isDisabled, setIsDisabled] = useState(false);
  const parsedInputAmount = inputAmount
    ? parseUnits(inputAmount, sourceToken.decimals).toString()
    : undefined;
  const [needApprove, setNeedApprove] = useState(false);
  const [withPM, setWithPM] = useState(true);

  function isBalanceSufficient() {
    const selectedToken = tokenList.find(
      (token) => token.address === sourceToken.address,
    );
    const isSelectedSellTokenHasSufficientBalance =
      selectedToken && inputAmount
        ? parseUnits(inputAmount, sourceToken.decimals) <
          BigInt(selectedToken.balance)
        : true;
    if (isSelectedSellTokenHasSufficientBalance) {
      return true;
    } else {
      return false;
    }
  }

  async function handleExecuteBridgeClickEOA() {
    const walletClient = createPkpViemWalletClient(
      currentPKP!.publicKey,
      sessionSigs!,
      sourceNetwork.chainId,
    );
    if (bridgeQuote) {
      setIsDisabled(true);
      const execute = await socket.start(bridgeQuote);
      let next = await execute.next();
      while (!next.done && next.value) {
        const tx = next.value;
        // Setup the provider and wallet based on `tx.chainId` and `quote.sender` if needed
        const approvalTxData = await tx.getApproveTransaction();
        if (approvalTxData) {
          setNeedApprove(true);
          await walletClient.sendTransaction({
            account: walletClient.account!,
            to: approvalTxData.to as `0x${string}`,
            data: approvalTxData.data as `0x${string}`,
            chain: walletClient.chain,
          });
        }
        const sendTxData = await tx.getSendTransaction();
        const sendTx = await walletClient.sendTransaction({
          account: walletClient.account!,
          to: sendTxData.to as `0x${string}`,
          data: sendTxData.data as `0x${string}`,
          value: BigInt(sendTxData.value),
          chain: walletClient.chain,
        });
        next = await execute.next(sendTx);
      }
    }
  }
  // Execute Bridge
  async function handleExecuteBridgeClick4337() {
    const signer = withPM
      ? await zeroDevSignerWithERC20Gas(
          'USDC',
          currentPKP?.publicKey!,
          sessionSigs!,
          sourceNetwork.chainId,
        )
      : await zeroDevSigner(
          currentPKP?.publicKey!,
          sessionSigs!,
          sourceNetwork.chainId,
        );
    if (bridgeQuote) {
      setIsDisabled(true);
      const execute = await socket.start(bridgeQuote);
      let next = await execute.next();
      while (!next.done && next.value) {
        const tx = next.value;
        // Setup the provider and wallet based on `tx.chainId` and `quote.sender` if needed
        const approvalTxData = await tx.getApproveTransaction();
        if (approvalTxData) {
          setBridgeExecuteStatus(
            `Need Allowance Setting Up Allowance for ${sourceToken.name}`,
          );
          const _sendTxData = await tx.getSendTransaction();
          const sendTx = await signer.sendUserOperation([
            {
              target: approvalTxData.to as `0x${string}`,
              data: approvalTxData.data as `0x${string}`,
            },
            {
              target: _sendTxData.to as `0x${string}`,
              data: _sendTxData.data as `0x${string}`,
              value: BigInt(_sendTxData.value),
            },
          ]);
          setBridgeExecuteStatus(
            `UserOperation Hash: ${sendTx.hash} \n UserOperation Request: ${sendTx.request} `,
          );
          await execute.next(sendTx.hash);
        } else {
          setBridgeExecuteStatus('No Allowance needed Sending UserOperation');
          const _sendTxData = await tx.getSendTransaction();
          const sendTx = await signer.sendUserOperation({
            target: _sendTxData.to as `0x${string}`,
            data: _sendTxData.data as `0x${string}`,
            value: BigInt(_sendTxData.value),
          });
          setBridgeExecuteStatus(
            `UserOperation Hash: ${sendTx.hash} \n UserOperation Request: ${sendTx.request} `,
          );
          next = await execute.next(sendTx.hash);
        }
        next.done
          ? setBridgeExecuteStatus('Bridge Execution Done')
          : setBridgeExecuteStatus('Executing Next Transaction');
      }
      setIsDisabled(false);
    }
  }

  //Change networkList on source and dest network changes
  useEffect(() => {
    if (socket) {
      async function getBridgeTokenList() {
        const _tokenList = await socket.getTokenList({
          toChainId: sourceNetwork.chainId,
          fromChainId: destNetwork.chainId,
          isShortList: true,
        });
        return _tokenList;
      }
      if (sourceNetwork && destNetwork) {
        getBridgeTokenList().then((res) => {
          setSourceTokenList(res.from.tokens as BridgeCurrency[]);
          setDestTokenList(res.to.tokens as BridgeCurrency[]);
        });
      } else if (sourceNetwork && destNetwork && inputAmount) {
        if (parsedInputAmount && parsedInputAmount !== '0') {
          const path = new Path({
            fromToken: sourceToken as Token,
            toToken: destToken as Token,
          });
          socket
            .getBestQuote(
              {
                path,
                amount: parsedInputAmount,
                address:
                  selectedWallet === 'zeroDev'
                    ? zeroDevAddress
                    : pkpViemAddress,
              },
              {
                isContractCall: selectedWallet === 'zeroDev' ? true : false,
                sort: SortOptions.Time,
              },
            )
            .then((res) => {
              setBridgeQuote(res);
              setSelectedRoute(res.route);
              setOutputAmount(res.route.toAmount);
            });
        }
      }
    }
  }, [destNetwork, sourceNetwork]);

  // set selected tokens
  useEffect(() => {
    if (sourceToken && destToken) {
      const _selectedSourceToken = tokenList.find(
        (token) => token.address === sourceToken.address,
      );
      const _selectedDestToken = tokenList.find(
        (token) => token.address === destToken.address,
      );
      if (_selectedSourceToken) {
        const _sourceToken: BridgeCurrency = {
          address: _selectedSourceToken.address,
          decimals: _selectedSourceToken.decimals,
          name: _selectedSourceToken.name,
          symbol: _selectedSourceToken.symbol,
          logoURI: _selectedSourceToken.logoUrl,
        };
        setSourceToken(_sourceToken);
        setSelectedSourceTokenBalance(_selectedSourceToken.balance);
      } else if (_selectedDestToken) {
        const _destToken: BridgeCurrency = {
          address: _selectedDestToken.address,
          decimals: _selectedDestToken.decimals,
          name: _selectedDestToken.name,
          symbol: _selectedDestToken.symbol,
          logoURI: _selectedDestToken.logoUrl,
        };
        setDestToken(_destToken);
        setSelectedDestTokenBalance(_selectedDestToken.balance);
      }
    }
  }, [destToken, sourceToken]);

  useEffect(() => {
    if (sourceToken && destToken && inputAmount) {
      if (parsedInputAmount && parsedInputAmount !== '0') {
        const path = new Path({
          fromToken: sourceToken as Token,
          toToken: destToken as Token,
        });
        socket
          .getBestQuote(
            {
              path,
              amount: parsedInputAmount,
              address:
                selectedWallet === 'zeroDev' ? zeroDevAddress : pkpViemAddress,
            },
            {
              isContractCall: selectedWallet === 'zeroDev' ? true : false,
              sort: SortOptions.Time,
            },
          )
          .then((res) => {
            setBridgeQuote(res);
            setSelectedRoute(res.route);
            setOutputAmount(res.route.toAmount);
          });
      }
    }
  }, [sourceToken, destToken, inputAmount, parsedInputAmount, sourceToken]);

  return (
    <div className="bg-white">
      <div className="dropdown">
        <label tabIndex={0} className="btn m-1">
          From: {sourceNetwork.name}
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 shadow"
        >
          {sourceNetworkList !== undefined
            ? sourceNetworkList.map((sourceNetwork, idx) => (
                <li key={idx} onClick={() => setSourceNetwork(sourceNetwork)}>
                  <a>{sourceNetwork.name} </a>
                </li>
              ))
            : null}
        </ul>
      </div>
      <div className="dropdown">
        <label tabIndex={0} className="btn m-1">
          {sourceNetwork.name}
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 shadow"
        >
          {sourceTokenList !== undefined
            ? sourceTokenList.map((sourceToken, idx) => (
                <li
                  key={idx}
                  onClick={() => setDebouncedSourceToken(sourceToken)}
                >
                  <span>{sourceToken.logoURI}</span>
                  <a>{sourceToken.name}</a>
                </li>
              ))
            : null}
        </ul>
      </div>
      <div className="form-control">
        <label className="input-group">
          <input
            onChange={(e) => setDebouncedInputAmount(e.target.value)}
            type="text"
            placeholder="0.0"
            className="input input-bordered bg-white"
          />
          <span className="bg-white">{sourceToken.symbol}</span>
        </label>
      </div>
      <div className="dropdown">
        <label tabIndex={0} className="btn m-1">
          TO: {destNetwork.name}
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 shadow"
        >
          {destNetworkList !== undefined
            ? destNetworkList.map((destNetwork, idx) => (
                <li key={idx} onClick={() => setDestNetwork(destNetwork)}>
                  <a>{destNetwork.name} </a>
                </li>
              ))
            : null}
        </ul>
      </div>
      <div className="dropdown">
        <label tabIndex={0} className="btn m-1">
          {destToken.name}
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 shadow"
        >
          {destTokenList !== undefined
            ? destTokenList.map((destToken, idx) => (
                <li key={idx} onClick={() => setDestToken(destToken)}>
                  <span>{destToken.logoURI}</span>
                  <a>{destToken.name} </a>
                </li>
              ))
            : null}
        </ul>
      </div>
      <div>
        {erc20BalanceToReadable(outputAmount, destToken.decimals)}{' '}
        {destToken.symbol}
      </div>
      <div>Send With Pay Master</div>
      <input
        type="checkbox"
        checked={withPM}
        onChange={() => setWithPM(true)}
        className="checkbox ml-0.5"
      />
      {isBalanceSufficient() && isDisabled && selectedRoute ? (
        <div
          className="btn m-1"
          onClick={() =>
            selectedWallet === 'zeroDev'
              ? handleExecuteBridgeClick4337()
              : handleExecuteBridgeClickEOA()
          }
        >
          Execute Bridge Route
        </div>
      ) : (
        <button className="btn btn-disabled m-1">InSufficient Balance</button>
      )}
      <div>
        <h1>{bridgeExecuteStatus}</h1>
      </div>
    </div>
  );
}
