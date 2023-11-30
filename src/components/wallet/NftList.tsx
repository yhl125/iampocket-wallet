import { EIP155_CHAINS } from '@/data/EIP155Data';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';
import Image from 'next/image';
import { useSnapshot } from 'valtio';
import Text from '../commons/Text';
import styled from 'styled-components';
import theme from '@/styles/theme';
import React, { useCallback, useEffect, useState } from 'react';
import DropDown from '../commons/DropDown';

interface IProps {
  chainIds: number[];
}
function NftList({ chainIds }: IProps) {
  // TODO : Change Data (current : dummy data)

  const [allChains, setAllChains] = useState<any>([]);
  const [selectedChain, setSelectedChain] = useState<any>({
    name: 'All',
    chainId: 0,
    logo: '/chain-logos/eip155/42161.svg',
  });

  const nftList: any[] = [
    {
      nftName: 'mer collection',
      name: 'jjang',
      image: '/images/merDog.JPG',
      chainId: 80001,
    },
    {
      nftName: 'mer collection',
      name: 'jjang',
      image: '/images/merDog.JPG',
      chainId: 10,
    },
  ];

  const generateChainDropdown = useCallback(() => {
    const result = chainIds.map((id: number) => {
      return {
        name: EIP155_CHAINS[`eip155:${id}`].name,
        chainId: EIP155_CHAINS[`eip155:${id}`].chainId,
        logo: EIP155_CHAINS[`eip155:${id}`].logo,
      };
    });

    return result;
  }, [chainIds]);
  useEffect(() => {
    if (nftList.length !== 0) {
      const result = generateChainDropdown();
      setAllChains([{ name: 'All', chainId: 0, logo: '' }, ...result]);
    }
  }, [generateChainDropdown, nftList.length]);

  if (nftList.length === 0) {
    return (
      <Container>
        <EmptyContent>
          <Text size="body2" color="bg30">
            You have no balance on Tokens.
          </Text>
        </EmptyContent>
      </Container>
    );
  } else {
    return (
      <Container>
        <SearchRow>
          <DropDown
            size="small"
            contents={allChains}
            selectContentState={selectedChain}
            setSelectContentState={setSelectedChain}
            iconKey="logo"
            nameKey="name"
          />
          <></>
        </SearchRow>
        <Table>
          {nftList.map((nft: any, idx: number) => (
            <NftUnit key={idx}>
              <ImageFrame>
                <Image
                  src={nft.image}
                  width={500}
                  height={500}
                  alt={'chain logo'}
                  style={{ borderRadius: '5px 5px 0px 0px' }}
                />
              </ImageFrame>
              <TextWrapper>
                <Text size="body5" color="bg30">
                  {nft.nftName}
                </Text>
                <Text size="body4" $bold>
                  {nft.name}
                </Text>
              </TextWrapper>
            </NftUnit>
          ))}
        </Table>
      </Container>
    );
  }
}

const Container = styled.div`
  margin-bottom: ${theme.space.xLarge};
`;

const EmptyContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const SearchRow = styled.div`
  margin-top: ${theme.space.xSmall};
  display: grid;
  grid-template-columns: 1fr 2fr;
`;
const Table = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: ${theme.space.xSmall};
  gap: 16px;
`;

const NftUnit = styled.div`
  background-color: ${theme.color.bg80};
  max-width: 180px;
  min-width: 130px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
  flex-grow: 1;
  gap: 10%;
`;

const ImageFrame = styled.div`
  width: fit-content;
  overflow: hidden;
`;

const TextWrapper = styled.div`
  row-gap: ${theme.space.tiny};

  display: flex;
  flex-direction: column;
  margin: 12px 8px;
`;

export default NftList;
