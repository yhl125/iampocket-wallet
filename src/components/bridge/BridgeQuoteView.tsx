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
  TokenList,
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
import Image from 'next/image';
import styled from 'styled-components';
import theme from '@/styles/theme';
import Button from '../commons/Button';
import Text from '@/components/commons/Text';
import DropDown from '../commons/DropDown';
import Icon from '../commons/Icon';
import CheckBox from '../commons/CheckBox';

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
  setSelectedRoute: (route: BridgeRoute | undefined) => void;
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
  const [withPM, setWithPM] = useState(false);

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
    console.log(withPM);
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
          console.log(_sendTxData);
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
          console.log(sendTx);
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
          console.log(sendTx);
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
  function fallbackToUSDC(tokenList: Token[]) {
    return (
      tokenList.filter(
        (token) =>
          (token?.chainAgnosticId?.toLowerCase() ||
            token.symbol.toLowerCase()) === 'usdc',
      )?.[0] ?? tokenList[0]
    );
  }
  async function getBridgeTokenListAndSetTokens(
    sourceNetworkChainId: number,
    destNetworkChainId: number,
  ) {
    const _tokenList = await socket.getTokenList({
      fromChainId: sourceNetworkChainId,
      toChainId: destNetworkChainId,
      isShortList: true,
    });
    setSourceToken(fallbackToUSDC(_tokenList.from.tokens) as BridgeCurrency);
    setSourceTokenList(_tokenList.from.tokens as BridgeCurrency[]);
    setDestToken(fallbackToUSDC(_tokenList.to.tokens) as BridgeCurrency);
    setDestTokenList(_tokenList.to.tokens as BridgeCurrency[]);
    return _tokenList;
  }

  // // set selected tokens
  useEffect(() => {
    if (sourceToken && destToken) {
      const _selectedSourceToken = tokenList.find(
        (token) => token.address === sourceToken.address,
      );
      const _selectedDestToken = tokenList.find(
        (token) => token.address === destToken.address,
      );
      if (_selectedSourceToken) {
        setSelectedSourceTokenBalance(_selectedSourceToken.balance);
      }
      if (_selectedDestToken) {
        setSelectedDestTokenBalance(_selectedDestToken.balance);
      }
    }
  }, [destToken, sourceToken, tokenList]);

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
            if (res?.route) {
              setBridgeQuote(res);
              setSelectedRoute(res.route);
              setOutputAmount(res.route.toAmount);
            } else {
              setBridgeQuote(undefined);
              setSelectedRoute(undefined);
              setOutputAmount('0');
            }
          });
      }
    }
  }, [sourceToken, destToken, inputAmount]);

 

  useEffect(()=>{
    setSourceNetwork(sourceNetwork);
    getBridgeTokenListAndSetTokens(
      sourceNetwork.chainId,
      destNetwork.chainId,
    );
    setDestNetwork(destNetwork);
    getBridgeTokenListAndSetTokens(
      sourceNetwork.chainId,
      destNetwork.chainId,
    );
  },[destNetwork,sourceNetwork])
  
  return (
    <Container>
      {/* <div className="dropdown">
        <label tabIndex={0} className="btn m-1">
          From: {sourceNetwork.name}
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 shadow"
        >
          {sourceNetworkList !== undefined
            ? sourceNetworkList.map((sourceNetwork, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setSourceNetwork(sourceNetwork);
                    getBridgeTokenListAndSetTokens(
                      sourceNetwork.chainId,
                      destNetwork.chainId,
                    );
                  }}
                >
                  <a>{sourceNetwork.name} </a>
                </li>
              ))
            : null}
        </ul>
      </div>
      <div className="dropdown">
        <label tabIndex={0} className="btn m-1">
          {sourceToken.symbol}
          <Image
            src={sourceToken.logoURI}
            alt="source token image"
            width={20}
            height={20}
          ></Image>
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 shadow"
        >
          {sourceTokenList !== undefined
            ? sourceTokenList.map((sourceToken, idx) => (
                <li key={idx} onClick={() => setSourceToken(sourceToken)}>
                  <label tabIndex={0} className="btn m-1">
                    {sourceToken.name}
                    <Image
                      src={sourceToken.logoURI}
                      alt="source token image"
                      width={20}
                      height={20}
                    ></Image>
                  </label>
                </li>
              ))
            : null}
        </ul>
        <span>
          Balance:
          {''}
          {selectedSourceTokenBalance} {sourceToken.symbol}
        </span>
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
      </div> */}

      <InputWrapper>
        <SelectWrapper>
          <DropDownWrapper>
            <Text size="body3" color="bg40">
              {' '}
              Network
            </Text>
            <DropDown
              contents={sourceNetworkList}
              selectContentState={sourceNetwork}
              setSelectContentState={setSourceNetwork}
              iconKey="logoURI"
              nameKey="name"
              size="small"
            />
          </DropDownWrapper>
          <DropDownWrapper>
            <Text size="body3" color="bg40">
              {' '}
              Token
            </Text>
            <DropDown
              contents={sourceTokenList}
              selectContentState={sourceToken}
              setSelectContentState={setSourceToken}
              iconKey="logoURI"
              nameKey="name"
              size="small"
            />
          </DropDownWrapper>
        </SelectWrapper>

        <StyledInput
          type="text"
          dir="rtl"
          onChange={(e: any) => setDebouncedInputAmount(e.target.value)}
          placeholder="0"
        />
      </InputWrapper>

      <DividerWrapper>
        <Divider />
        <IconWrapper>
          <Icon type="bridge" height={40} />
        </IconWrapper>
      </DividerWrapper>

      <InputWrapper>
        {/* <Text size="title2" color="bg40">
              To
            </Text> */}
        <SelectWrapper>
          <DropDownWrapper>
            <Text size="body3" color="bg40">
              Network
            </Text>
            <DropDown
              contents={destNetworkList}
              selectContentState={destNetwork}
              setSelectContentState={setDestNetwork}
              iconKey="logoURI"
              nameKey="name"
              size="small"
            />
          </DropDownWrapper>
          <DropDownWrapper>
            <Text size="body3" color="bg40">
              Token
            </Text>
            <DropDown
              contents={destTokenList}
              selectContentState={destToken}
              setSelectContentState={setDestToken}
              iconKey="logoURI"
              nameKey="name"
              size="small"
            />
          </DropDownWrapper>
        </SelectWrapper>
        <ResultAmountTextWrapper>
          <Text size="title1">
            {erc20BalanceToReadable(outputAmount, destToken.decimals)}{' '}
            {destToken.symbol}
          </Text>
        </ResultAmountTextWrapper>
      </InputWrapper>

      {/* <div className="dropdown">
        <label tabIndex={0} className="btn m-1">
          TO: {destNetwork.name}
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 shadow"
        >
          {destNetworkList !== undefined
            ? destNetworkList.map((destNetwork, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setDestNetwork(destNetwork);
                    getBridgeTokenListAndSetTokens(
                      sourceNetwork.chainId,
                      destNetwork.chainId,
                    );
                  }}
                >
                  <a>{destNetwork.name} </a>
                </li>
              ))
            : null}
        </ul>
      </div>
      <div className="dropdown">
        <label tabIndex={0} className="btn m-1">
          {destToken.symbol}
          <Image
            src={destToken.logoURI}
            alt="dset token image"
            width={20}
            height={20}
          ></Image>
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 shadow"
        >
          {destTokenList !== undefined
            ? destTokenList.map((destToken, idx) => (
                <li key={idx} onClick={() => setDestToken(destToken)}>
                  <label tabIndex={0} className="btn m-1">
                    {destToken.name}
                    <Image
                      src={destToken.logoURI}
                      alt="dest token image"
                      width={20}
                      height={20}
                    ></Image>
                  </label>
                </li>
              ))
            : null}
        </ul>
        <span>
          Balance: {selectedDestTokenBalance} {destToken.symbol}
        </span>
      </div> */}






      <InfoWrapper>
        <DetailWrapper>
          <Text size="body4" color="bg40">
            Bridge Name
          </Text>
          <Text size="body2">
            {selectedRoute?.usedBridgeNames.map((bridgeName, idx) => (
              <span key={idx}>{bridgeName}</span>
            ))}
          </Text>
        </DetailWrapper>
        <DetailWrapper>
          <Text size="body4" color="bg40">
            Estimated output Value (USD)
          </Text>
          <Text size="body2"> {selectedRoute?.outputValueInUsd}</Text>
        </DetailWrapper>
        <DetailWrapper>
          <Text size="body4" color="bg40">
            Estimated Time (Seconds)
          </Text>
          <Text size="body2">{selectedRoute?.serviceTime}</Text>
        </DetailWrapper>
        <DetailWrapper>
          <Text size="body4" color="bg40">
            Gas Fee (USD)
          </Text>
          <Text size="body2"> {selectedRoute?.totalGasFeesInUsd}</Text>
        </DetailWrapper>
      </InfoWrapper>









      <ExecuteWrapper>
        {selectedWallet === 'pkpViem' ? null : (
          <PaymasterWrapper>
            <Text size="title3" color={withPM ? 'bg0' : 'bg40'}>
            Execute with Paymaster
            </Text>
            <CheckBox checkState={withPM} setCheckState={setWithPM} />
          </PaymasterWrapper>
        )}

        {bridgeExecuteStatus === '' ? (
          <Button
            text={
              isBalanceSufficient() && selectedRoute
                ? 'Execute Bridge Route'
                : 'InSufficient Balance'
            }
            size="large"
            type="primary"
            disabled={isBalanceSufficient() && selectedRoute ? false : true}
            onClick={() =>
              selectedWallet === 'zeroDev'
                ? handleExecuteBridgeClick4337()
                : handleExecuteBridgeClickEOA()
            }
          />
        ) : (
          <Text size="body1" color="systemOrange" $thin>
            No Allowance needed Sending UserOperation No Allowance needed
            Sending UserOperation
            {/* {bridgeExecuteStatus} */}
          </Text>
        )}
      </ExecuteWrapper>
    </Container>
  );
}

const Container = styled.div`
  row-gap: ${theme.space.medium};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InfoWrapper = styled.div`
  row-gap: ${theme.space.small};
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid ${theme.color.bg40};
  padding: ${theme.space.base};
  width: 100%;
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const SelectWrapper = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;

  row-gap: ${theme.space.tiny};
`;
const DropDownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.xTiny};
`;
const StyledInput = styled.input`
  width: 100%;
  color: ${theme.color.bg0};
  font-size: ${theme.fontSize.title1};
  line-height: ${theme.lineHeight.title1};
  font-weight: 700;
  &::placeholder {
    color: ${theme.color.bg30};
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DividerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0px;
`;
const IconWrapper = styled.div`
  background-color: ${theme.color.bg50};
  border-radius: 50%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

const Divider = styled.div`
  background-color: ${theme.color.bg50};
  height: 1px;
  width: 100%;
  position: relative;
`;

const ExecuteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.xSmall};
`;
const PaymasterWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: ${theme.space.xSmall};
`;

const ResultAmountTextWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
