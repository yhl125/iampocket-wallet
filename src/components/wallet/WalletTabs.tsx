'use client';

import theme from '@/styles/theme';
import React, { SetStateAction, useState } from 'react';
import styled from 'styled-components';
import Text from '../commons/Text';

const TABS = [
  // {
  //   title: 'Activity',
  //   index: 0,
  // },
  {
    title: 'Assets',
    index: 0,
  },
  {
    title: 'NFTs',
    index: 1,
  },
];

interface IProps {
  activeItem: number;
  setActiveItem: React.Dispatch<SetStateAction<number>>;
}

function WalletTabs({ activeItem, setActiveItem }: IProps) {
  return (
    <Container>
      <Content>
        <Divider />
        {TABS.map((item) => {
          const active = activeItem === item.index;
          return (
            <TabItem
              key={item.title}
              active={active}
              onClick={() => {
                setActiveItem(item.index);
              }}
            >
              <Text size="body1" color={active ? 'brandBlue50' : 'bg0'}>
                {item.title}
              </Text>
            </TabItem>
          );
        })}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  margin-top: ${theme.space.mLarge};
`;

const Content = styled.div`
  display: flex;
  /* border-bottom: 1px solid ${theme.color.bg50}; */

  position: relative;
`;
const TabItem = styled.div<{ active: boolean }>`
  cursor: pointer;
  padding: ${theme.space.xSmall} ${theme.space.base};
  z-index: 2;

  border-bottom: ${({ active }) =>
    active && `3px solid ${theme.color.brandBlue50}`};
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.color.bg50};

  position: absolute;
  bottom: 0px;
  z-index: 1;
`;

export default WalletTabs;
