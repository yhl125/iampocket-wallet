'use client';

export const dynamic = 'force-dynamic';

import TokenStore, { ResponseToken } from '@/store/TokenStore';
import { gql } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';

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

export default function FetchToken(props: IProps) {
  const { data } = useSuspenseQuery(query, {
    variables: {
      address: props.address,
      chainId: props.chainId,
      quoteCurrency: props.quoteCurrency,
    },
  });
  TokenStore.addTokens(
    (data as any).findEvmTokenBalance as ResponseToken[],
    props.chainId
  );
  return <></>;
}
