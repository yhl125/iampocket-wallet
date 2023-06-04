'use client';

import { ethers } from 'ethers';
import TokenStore from '@/store/TokenStore';
import { useSnapshot } from 'valtio';
import SettingsStore from '@/store/SettingsStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatEther } from 'ethers/lib/utils';
import { providerOf } from '@/utils/ProviderUtil';
interface tokenAttribute {
  address: string;
  decimal?: number;
  symbol?: string;
}

const ManageTokenPage = () => {
  const [address, setAddress] = useState<string>('');
  const [symbol, setSymbol] = useState<string>();
  const [decimal, setDecimal] = useState<number>();
  const { erc4337Address } = useSnapshot(SettingsStore.state);

  const router = useRouter();

  const ERC_20Abi = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address owner) view returns (uint256)',
  ];

  const getTokenInfo = async (token: tokenAttribute) => {
    const provider = providerOf(80001);
    const contract = new ethers.Contract(token.address, ERC_20Abi, provider);
    const [name, symbol, tokenBalance, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.balanceOf(erc4337Address),
      contract.decimals(),
    ]);
    const balance = formatEther(tokenBalance);

    TokenStore.addTokenInfo({
      name: name,
      balance: balance,
      tokenSymbol: symbol,
      tokenDecimal: decimals,
      tokenAddress: address,
    });
    router.push('/wallet');
  };
  const handleSubmit = async (event: any) => {
    if (address == '') {
      alert('Please input Token Address');
      return;
    }
    event.preventDefault();
    const token = {
      address: address as string,
      symbol: symbol,
      decimal: decimal,
    };
    await getTokenInfo(token);
  };

  return (
    <>
      <div className="add-token">
        <div className="form-control">
          <form onSubmit={handleSubmit}>
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <label className="input-group">
              <span>Address</span>
              <input
                onChange={(e: any) => {
                  setAddress(e.target.value);
                }}
                type="text"
                placeholder="Token Address"
                className="input-bordered input"
              />
            </label>
            <label className="label">
              <span className="label-text">Symbol</span>
            </label>
            <label className="input-group">
              <span>Symbol</span>
              <input
                onChange={(e: any) => {
                  setSymbol(e.target.value);
                }}
                type="text"
                placeholder="Symbol"
                className="input-bordered input"
              />
            </label>
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <label className="input-group">
              <span>Address</span>
              <input
                onChange={(e: any) => {
                  setDecimal(e.target.value);
                }}
                type="number"
                placeholder="Decimal"
                className="input-bordered input"
              />
            </label>
            <div className="add-token mt-7">
              <button type="submit" className="btn-ghost btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageTokenPage;
