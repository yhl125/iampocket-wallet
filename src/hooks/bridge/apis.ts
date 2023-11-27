import {
  Socket,
  Supported,
  SupportedChainsOutputDTO,
} from '@socket.tech/socket-v2-sdk';
import { useState, useEffect } from 'react';

export let socket: Socket;

export const initSocket = (apiKey: string, _singleTxOnly: boolean) => {
  socket = new Socket({
    apiKey: apiKey,
    defaultQuotePreferences: {
      singleTxOnly: _singleTxOnly,
    },
  });
};

export const useBridgeChains = () => {
  const [allChains, setAllChains] = useState<SupportedChainsOutputDTO | null>(
    null,
  );
  useEffect(() => {
    async function fetchSupportedNetworks() {
      const supportedNetworks = await Supported.getAllSupportedChains();
      setAllChains(supportedNetworks);
    }
    fetchSupportedNetworks();
  }, []);

  return allChains;
};
