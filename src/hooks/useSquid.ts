import AddressStore from '@/store/AddressStore';
import PKPStore from '@/store/PKPStore';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { Squid } from '@0xsquid/sdk';
import SquidStore from '@/store/SquidStore';
import { TokenData, ChainData, ChainsData } from '@/data/SquidData';

export default function useSquid() {
  const { erc4337Address } = useSnapshot(AddressStore.state);
  const { isAuthenticated, currentPKP, sessionSigs, sessionExpiration } =
    useSnapshot(PKPStore.state);
  const { isSquidInit } = useSnapshot(SquidStore.state);

  const squidInit = async () => {
    const squid = new Squid({
      baseUrl: 'https://testnet.api.squidrouter.com', // for mainnet use "https://api.0xsquid.com"
      integratorId: 'iampocket-sdk',
    });

    squid.setConfig({
      baseUrl: 'https://testnet.api.squidrouter.com', // for mainnet use "https://api.0xsquid.com"
      integratorId: 'iampocket-sdk',
    });
    await squid.init();
    console.log('Squid inited');
    return squid;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Not Authenticated');
      return;
    }
    if (erc4337Address && sessionSigs && isSquidInit === false) {
      console.log(isSquidInit);
      squidInit().then((res: Squid) => {
        SquidStore.setSquidInit();
        const squid: Squid = res;
        const tokens = squid.tokens as TokenData[];
        const chains = squid.chains as unknown as ChainsData;
        SquidStore.setChainDataList(chains);
        SquidStore.setTokenDataList(tokens);
      });
      return;
    }
    if (erc4337Address && sessionSigs && isSquidInit === true) {
      return;
    }
    if (
      erc4337Address === '' &&
      sessionSigs === undefined &&
      isSquidInit === false
    ) {
      return;
    }
  }, [erc4337Address, sessionSigs, isAuthenticated]);
}
