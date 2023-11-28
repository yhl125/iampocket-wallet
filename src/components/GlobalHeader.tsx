'use client';

import React from 'react';
import styled from 'styled-components';
import { usePathname, useRouter } from 'next/navigation';
import theme from '@/styles/theme';
import { usePc } from '@/hooks/usePc';
import IconButton from './commons/IconButton';
import Icon from './commons/Icon';
import IconTextButton from './commons/IconTextButton';

// MEMO: Global Navigation Header
const Header = () => {
  const isPc = usePc();
  const pathName = usePathname();

  const router = useRouter();

  return (
    <Container $isPc={isPc}>
      <Left>
        <Icon
          type="logo"
          color="brandBlue50"
          height={isPc ? 'display' : 'title1'}
        />
        {pathName != `/login` && pathName != `/signup` && isPc && (
          <HeaderButtonWrapper>
            <IconTextButton
              text="wallet"
              size="large"
              icon="wallet"
              onClick={() => {
                router.push('/wallet');
              }}
            />
            <IconTextButton
              text="Trading"
              size="large"
              icon="trade"
              onClick={() => {
                router.push('/lit-listener');
              }}
            />
            <IconTextButton
              text="Chatting"
              size="large"
              icon="chat"
              onClick={() => {
                return;
              }}
            />
            <IconTextButton
              text="Settings"
              size="large"
              icon="setting"
              onClick={() => {
                return;
              }}
            />
          </HeaderButtonWrapper>
        )}
      </Left>
      <Right>
        {pathName != `/login` && pathName != `/signup` && !isPc && (
          <IconButton
            text=""
            icon="menu"
            size="small"
            type="secondary"
            onClick={() => {
              return;
            }}
          />
        )}
      </Right>
    </Container>
  );
};

const Container = styled.header<{ $isPc: boolean }>`
  width: 100%;
  display: flex;

  justify-content: space-between;
  align-items: center;
  position: fixed;
  padding: ${(props) =>
    props.$isPc
      ? `${theme.space.medium} ${theme.space.mLarge}`
      : `${theme.space.small} ${theme.space.sMedium}`};
`;

const HeaderButtonWrapper = styled.div`
  display: flex;
  gap: ${theme.space.mLarge};
  width: 100%;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.mLarge};
`;
const Right = styled.div``;

export default Header;
