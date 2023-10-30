'use client';

export const dynamic = 'force-dynamic';

import TokenStore, { IResponseToken } from '@/store/TokenStore';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr';

const query = gql`
  query findEvmTokenBalance(
    $address: String!
    $chainIds: [Int!]!
    $quoteCurrency: QuoteCurrency!
  ) {
    findEvmTokenBalance(
      address: $address
      chainIds: $chainIds
      quoteCurrency: $quoteCurrency
    ) {
      chainId
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
  chainIds: number[];
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
      chainIds: props.chainIds,
      quoteCurrency: props.quoteCurrency,
    },
    pollInterval,
  });
  if (data) {
    TokenStore.addTokens(data.findEvmTokenBalance as IResponseToken[]);
  }
}

function FetchTokens(props: FetchTokensProps) {
  FetchToken({
    address: props.address,
    chainIds: props.chainIds,
    quoteCurrency: props.quoteCurrency,
  });

  return <></>;
}

export default FetchTokens;
