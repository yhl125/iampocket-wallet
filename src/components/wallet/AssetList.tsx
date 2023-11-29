import TokenStore, { IResponseToken } from '@/store/TokenStore';
import styled from 'styled-components';
import { useSnapshot } from 'valtio';

import Text from '../commons/Text';
import theme from '@/styles/theme';
import { EIP155_CHAINS } from '@/data/EIP155Data';
import DropDown from '../commons/DropDown';
import { useEffect, useState } from 'react';
import TokenItem from './TokenItem';

interface IProps {
  chainIds: number[];
}

function AssetList({ chainIds }: IProps) {
  const { tokenList } = useSnapshot(TokenStore.tokenListState);
  const [allChains, setAllChains] = useState<any>([]);
  const [selectedChain, setSelectedChain] = useState<any>({
    name: 'All',
    chainId: 0,
    logo: '/chain-logos/eip155/42161.svg',
  });

  const generateChainDropdown = () => {
    const result = chainIds.map((id: number) => {
      return {
        name: EIP155_CHAINS[`eip155:${id}`].name,
        chainId: EIP155_CHAINS[`eip155:${id}`].chainId,
        logo: EIP155_CHAINS[`eip155:${id}`].logo,
      };
    });

    return result;
  };

  useEffect(() => {
    if (tokenList.length !== 0) {
      const result = generateChainDropdown();
      setAllChains([{ name: 'All', chainId: 0, logo: '' }, ...result]);
    }
  }, []);

  if (tokenList.length === 0) {
    return (
      <Container>
        <EmptyContent>
          <Text size="body2" color="bg30">
            You have no balance on Tokens.
          </Text>
        </EmptyContent>
      </Container>
    );
  }

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
        <TableHeader>
          <Text size="body4" $thin color="bg40">
            Assets
          </Text>
          <Text size="body4" $thin color="bg40">
            Amount
          </Text>
          <Text size="body4" $thin color="bg40">
            Total Price
          </Text>
          <Text size="body4" $thin color="bg40">
            Change
          </Text>
        </TableHeader>
        <TableBody>
          {tokenList.map((token: IResponseToken, index: number) => {
            const changeValue =
              (token?.quoteRate &&
                token?.quoteRate24hAgo &&
                ((token.quoteRate - token.quoteRate24hAgo) /
                  token.quoteRate24hAgo) *
                  100) ??
              0;
            if (
              selectedChain.name !== 'All' &&
              selectedChain.chainId === token.chainId
            ) {
              return <TokenItem token={token} changePercentage={changeValue} />;
            }
            if (selectedChain.name === 'All') {
              return <TokenItem token={token} changePercentage={changeValue} />;
            }
          })}
        </TableBody>
      </Table>
    </Container>
  );
}

const Container = styled.div``;

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
const Table = styled.div``;
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: auto 100px 74px 70px;
  grid-column-gap: ${theme.space.base};
  margin-top: ${theme.space.sMedium};
  margin-bottom: ${theme.space.small};
`;
const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.small};
`;
const TableItem = styled.div`
  display: grid;
  grid-template-columns: auto 100px 74px 70px;
  grid-column-gap: ${theme.space.base};
`;

export default AssetList;
