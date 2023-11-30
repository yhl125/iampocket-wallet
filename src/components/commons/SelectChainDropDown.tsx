'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { isAddress } from 'viem';
import styled from 'styled-components';

import theme from '@/styles/theme';
import Text from './Text';
import Input from './Input';
import DropDown from './DropDown';
import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { useSnapshot } from 'valtio';

interface Props {
  setChainId: (chainId: number) => void;
  size?: 'medium' | 'small';
}

function SelectChainDropDown({ setChainId, size = 'medium' }: Props) {
  const { tokenList } = useSnapshot<any>(TokenStore.tokenListState);
  const psudoToken: IResponseToken = {
    address: '',
    name: 'Token',
    symbol: 'Token',
    decimals: 18,
    logoUrl: '',
    nativeToken: false,
    type: '',
    balance: '0',
    quote: 0,
    prettyQuote: '0',
    quoteRate: 0,
    quoteRate24hAgo: 0,
    chainId: 80001,
  };
  const [selectedChain, setSelectedChain] = useState(() =>
    tokenList.length == 0 ? psudoToken : tokenList[0],
  );

  const getChainId = (list: any[], property: string) => {
    const uniqueValues = new Set();

    return list.reduce((uniqueArray, currentItem) => {
      const propertyValue = currentItem[property];

      if (!uniqueValues.has(propertyValue)) {
        uniqueValues.add(propertyValue);
        uniqueArray.push(currentItem);
      }

      return uniqueArray;
    }, []);
  };

  const uniqueChainIdList = getChainId(tokenList, 'chainId');

  useEffect(() => {
    setChainId(selectedChain.chainId);
  }, [selectedChain, setChainId]);

  return (
    <DropDown
      contents={uniqueChainIdList}
      selectContentState={selectedChain}
      setSelectContentState={setSelectedChain}
      iconKey="logoUrl"
      nameKey="chainId"
      size={size}
    />
  );
}

export default SelectChainDropDown;
