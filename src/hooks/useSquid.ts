import { useEffect } from 'react';
import { Squid } from '@0xsquid/sdk';
import SquidStore from '@/store/SquidStore';
import { TokenData, ChainsData } from '@/data/SquidData';

export default function useSquid() {
  function getSDK() {
    const squid = new Squid({
      baseUrl: 'https://testnet.api.squidrouter.com', // for mainnet use "https://api.0xsquid.com"
      integratorId: 'iampocket-sdk',
    });

    squid.setConfig({
      baseUrl: 'https://testnet.api.squidrouter.com', // for mainnet use "https://api.0xsquid.com"
      integratorId: 'iampocket-sdk',
    });
    return squid;
  }

  useEffect(() => {
    (async () => {
      const squid = getSDK();
      await squid.init();
      SquidStore.setSquidInit();
      const tokens = squid.tokens as TokenData[];
      const chains = squid.chains as unknown as ChainsData;
      SquidStore.setChainDataList(chains);
      SquidStore.setTokenDataList(tokens);
    })();
  }, []);
  return getSDK();
}
