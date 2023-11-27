'use client';

import { initSocket, socket, useBridgeChains } from '@/hooks/bridge/apis';
import { useIsMounted } from '@/hooks/useIsMounted';
import {
  BridgeCurrency,
  BridgeRoute,
  Network,
  defaultDestNetwork,
  defaultDestToken,
  defaultSourceNetwork,
  defaultSourceToken,
} from '@/utils/BridgeUtil';
import { ChainDetails, Route, SocketQuote } from '@socket.tech/socket-v2-sdk';
import { useEffect, useState } from 'react';
import BridgeQuote from './BridgeQuoteView';

export default function BridgeForm() {
  const [networkList, setNetworkList] = useState<ChainDetails[]>();
  const [sourceNetworkList, setSourceNetworkList] = useState<ChainDetails[]>();
  const [destNetworkList, setDestNetworkList] = useState<ChainDetails[]>();
  const [sourceNetwork, setSourceNetwork] =
    useState<ChainDetails>(defaultSourceNetwork);
  const [destNetwork, setDestNetwork] =
    useState<ChainDetails>(defaultDestNetwork);
  const [sourceToken, setSourceToken] =
    useState<BridgeCurrency>(defaultSourceToken);
  const [destToken, setDestToken] = useState<BridgeCurrency>(defaultDestToken);
  const [sourceTokenList, setSourceTokenList] = useState<BridgeCurrency[]>();
  const [destTokenList, setDestTokenList] = useState<BridgeCurrency[]>();
  const [bestRoute, setBestRoute] = useState<void | SocketQuote>();
  const [selectedRoute, setSelectedRoute] = useState<BridgeRoute>();
  const [routeList, setRouteList] = useState<BridgeRoute>();
  const [finalize, setFinalize] = useState(false);


  const allChains = useBridgeChains();
  const mounted = useIsMounted();

  if (!socket) {
    initSocket('72a5b4b0-e727-48be-8aa1-5da9d62fe635', true);
  }

  useEffect(() => {
    setNetworkList(allChains?.result);
    const sendingEnabledNetworks = allChains?.result.filter(
      (network) => network.sendingEnabled,
    );
    const receivingEnabledNetworks = allChains?.result.filter(
      (network) => network.receivingEnabled,
    );
    setSourceNetworkList(sendingEnabledNetworks);
    setDestNetworkList(receivingEnabledNetworks);
  }, [allChains]);
  return (
    <>
      {mounted && (
        <div>
          <BridgeQuote
            sourceNetwork={sourceNetwork}
            destNetwork={destNetwork}
            sourceToken={sourceToken}
            destToken={destToken}
            sourceTokenList={sourceTokenList}
            destTokenList={destTokenList}
            sourceNetworkList={sourceNetworkList}
            destNetworkList={destNetworkList}
            selectedRoute={selectedRoute}
            routes={routeList}
            setSourceNetwork={setSourceNetwork}
            setDestNetwork={setDestNetwork}
            setSourceToken={setSourceToken}
            setDestToken={setDestToken}
            setSourceTokenList={setSourceTokenList}
            setDestTokenList={setDestTokenList}
            setSelectedRoute={setSelectedRoute}
            setRoutes={setRouteList}
          />
        </div>
      )}
    </>
  );
}
