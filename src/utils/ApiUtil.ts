import { gql } from '@apollo/client';

export const findEvmTokenBalanceQuery = gql`
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
      totalQuote
      tokenList {
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
  }
`;
