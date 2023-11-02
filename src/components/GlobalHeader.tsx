'use client';

import React from 'react';
import styled from 'styled-components';

import theme from '@/styles/theme';
import Text from './commons/Text';
import Icon from './commons/Icon';
import {usePc} from '@/hooks/usePc'

// MEMO: Global Navigation Header
const Header = () => {
  let isPc=usePc()
  return (
    isPc
    ?
    <PcContainer>
      <Left>
          <Icon type="logo" color='brandBlue50' height='display'/>
          <Text size='title2' $bold>iamPocket</Text>
      </Left>
      <Right>
      </Right>
    </PcContainer>
    :
    <MobileContainer>
      <Left>
          <Icon type="logo" color='brandBlue50' height='title1'/>
          <Text size='title3' $bold>iamPocket</Text>
      </Left>
      <Right>
      </Right>
    </MobileContainer>
  );
};

const PcContainer = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  position : fixed;
  padding: ${theme.space.medium} ${theme.space.mLarge};
`;

const MobileContainer = styled(PcContainer)`
  padding: ${theme.space.medium} ${theme.space.base};
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.tiny};;
`;
const Right = styled.div``;

export default Header;
