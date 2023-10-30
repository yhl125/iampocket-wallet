'use client';

import React from 'react';
import styled from 'styled-components';

import theme from '@/styles/theme';
import Text from './commons/Text';
import Icon from './commons/Icon';

// MEMO: Global Navigation Header
const Header = () => {
  return (
    <Container>
      <Left>
          <Icon type="logo" color='brandBlue50' height='display'/>
          <Text size='title2' $bold>iamPocket</Text>
      </Left>
      <Right>
      </Right>
    </Container>
  );
};

const Container = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  position : fixed;
  padding: ${theme.space.medium} ${theme.space.mLarge};
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.tiny};;
`;
const Right = styled.div``;

export default Header;
