'use client';

import React from 'react';
import styled from 'styled-components';

import theme from '@/styles/theme';
import Text from './commons/Text';

// MEMO: Global Navigation Header
const Header = () => {
  return (
    <Container>
      <Left>
        <Text>iamPocket</Text>
      </Left>
      <Right></Right>
    </Container>
  );
};

const Container = styled.header`
  width: 100%;
  height: 50px;

  background-color: ${theme.color.backgroundPaper};
  border-bottom: 1px solid ${theme.color.borderLight};

  padding: ${theme.space.small};
`;

const Left = styled.div``;
const Right = styled.div``;

export default Header;
