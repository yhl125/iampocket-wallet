'use client';

export const dynamic = 'force-dynamic';

import TokenStore, { ResponseToken } from '@/store/TokenStore';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr';

const query = gql`
  query findEvmTokenBalance(
    $address: String!
    $chainId: Int!
    $quoteCurrency: QuoteCurrency!
  ) {
    findEvmTokenBalance(
      address: $address
      chainId: $chainId
      quoteCurrency: $quoteCurrency
    ) {
      address
      name
      symbol
      decimals
      logoUrl
      nativeToken
      type
      balance
      balance24hAgo
      quote
      prettyQuote
      quoteRate
      quoteRate24hAgo
    }
  }
`;

interface IProps {
  address: string;
  chainId: number;
  quoteCurrency: string;
}

interface FetchTokensProps {
  address: string;
  chainIds: number[];
  quoteCurrency: string;
}

function FetchToken(props: IProps) {
  // Poll every 30 seconds
  const pollInterval = 30 * 1000;
  const { data } = useQuery(query, {
    variables: {
      address: props.address,
      chainId: props.chainId,
      quoteCurrency: props.quoteCurrency,
    },
    pollInterval,
  });
  if (data) {
    TokenStore.addTokens(
      data.findEvmTokenBalance as ResponseToken[],
      props.chainId,
    );
  }
}

export default function FetchTokens(props: FetchTokensProps) {
  props.chainIds.forEach((chainId) => {
    FetchToken({
      address: props.address,
      chainId,
      quoteCurrency: props.quoteCurrency,
    });
  });
  return <></>;
};
export default FetchToken;
