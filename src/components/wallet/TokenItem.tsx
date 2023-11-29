import theme from '@/styles/theme';
import Image from 'next/image';
import styled from 'styled-components';
import TokenImage from '../commons/TokenImage';
import Text from '../commons/Text';
import { IResponseToken } from '@/store/TokenStore';
import { EIP155_CHAINS } from '@/data/EIP155Data';
import { erc20BalanceToReadable } from '@/utils/ERC20Util';

interface IProps {
  token: IResponseToken;
  changePercentage: number;
}
function TokenItem({ token, changePercentage }: IProps) {
  return (
    <Container>
      <TokenInfoWrapper>
        <TokenImageWrapper>
          <ChainImage
            src={EIP155_CHAINS[`eip155:${token.chainId}`]?.logo ?? ''}
            alt="chain logo"
            width={20}
            height={20}
          />
          <TokenImage
            logoUrl={token.logoUrl}
            address={token.address}
            imageKey={token.address + token.chainId}
            size={30}
          />
        </TokenImageWrapper>
        <TokenNameWrapper>
          <Text size="body3">{token.symbol}</Text>
          <Text size="body5" $thin color="bg30">
            {token.name}
          </Text>
        </TokenNameWrapper>
      </TokenInfoWrapper>
      <TokenAmountWrapper>
        <Text size="body3">
          {erc20BalanceToReadable(token.balance, token.decimals)}
        </Text>
      </TokenAmountWrapper>
      <TokenPriceWrapper>
        <Text size="body3">{token?.quote ? token.prettyQuote : '-'}</Text>
      </TokenPriceWrapper>
      <TokenChangeWrapper>
        {token?.quoteRate && token?.quoteRate24hAgo && (
          <ChangeChip type={changePercentage < 0 ? 'minus' : 'plus'}>
            <Text
              size="body3"
              $thin
              color={changePercentage < 0 ? 'systemRed' : 'systemGreen'}
            >{`${changePercentage.toFixed(2)}%`}</Text>
          </ChangeChip>
        )}
      </TokenChangeWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 100px 74px 70px;
  grid-column-gap: ${theme.space.base};
`;

const ChainImage = styled(Image)`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${theme.color.bg0};
  position: absolute;
  left: -10px;
  bottom: 0;
`;
const TokenInfoWrapper = styled.div`
  display: flex;
  margin-left: 10px;
  column-gap: ${theme.space.tiny};
`;
const TokenImageWrapper = styled.div`
  display: flex;
  position: relative;
`;
const TokenNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const TokenAmountWrapper = styled.div``;
const TokenPriceWrapper = styled.div``;
const TokenChangeWrapper = styled.div``;
const ChangeChip = styled.div<{ type: 'minus' | 'plus' }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.space.xTiny} ${theme.space.tiny};
  border-radius: 5px;
  border: 1px solid
    ${({ type }) =>
      type === 'plus' ? theme.color.systemGreen : theme.color.systemRed};
`;
export default TokenItem;
