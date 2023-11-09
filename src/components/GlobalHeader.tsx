'use client';

import React from 'react';
import styled from 'styled-components';

import theme from '@/styles/theme';
import {usePc} from '@/hooks/usePc';
import Text from './commons/Text';
import Icon from './commons/Icon';


// MEMO: Global Navigation Header
const Header = () => {

  const isPc = usePc();

  console.log(isPc)
  return (
 
    <Container isPc={isPc}>
      <Left>
          <Icon type="logo" color='brandBlue50' height={ isPc ? 'display' :'title1'}/>
          <HeaderButtonWrapper></HeaderButtonWrapper>
      </Left>
      <Right>
      </Right>
    </Container>
  
  );
};

const Container = styled.header< { isPc : boolean } >`
  width: 100%;
  display: flex;
  align-items: center;
  position : fixed;
  padding: ${props => (props.isPc ? `${theme.space.medium} ${theme.space.mLarge}` : `${theme.space.small} ${theme.space.sMedium}`)};

`;


const HeaderButtonWrapper =  styled.div`
  gap: 40px

`;


const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.tiny};
`;
const Right = styled.div``;

export default Header;
