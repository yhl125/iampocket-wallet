'use client';

import React from 'react';
import styled from 'styled-components';
import { usePathname, useRouter } from 'next/navigation';

import theme from '@/styles/theme';
import { usePc } from '@/hooks/usePc';
import Icon from './commons/Icon';
import IconTextButton from './commons/IconTextButton';
import TextButton from './commons/TextButton';

// MEMO: Global Navigation Header
const Header = () => {
  const isPc = usePc();
  const pathName = usePathname();

  const router = useRouter();

  return (
    <Container $isPc={isPc} $pathName={pathName}>
      <Left>
        <LogoWrapper
          onClick={() => {
            router.push('/wallet');
          }}
        >
          <Icon
            type="logo"
            color="brandBlue50"
            height={isPc ? 'display' : 'title1'}
          />
        </LogoWrapper>
        {pathName != `/login` && pathName != `/signup` && (
          <HeaderButtonWrapper>
            {isPc ? (
              <>
                <IconTextButton
                  text="wallet"
                  size={isPc ? 'large' : 'medium'}
                  icon="wallet"
                  onClick={() => {
                    router.push('/wallet');
                  }}
                />
                <IconTextButton
                  text="Automation"
                  size={isPc ? 'large' : 'medium'}
                  icon="trade"
                  onClick={() => {
                    router.push('/lit-listener');
                  }}
                />
              </>
            ) : (
              <>
                <TextButton
                  size="medium"
                  text="wallet"
                  onClick={() => {
                    router.push('/wallet');
                  }}
                />
                <TextButton
                  size="medium"
                  text="Automation"
                  onClick={() => {
                    router.push('/lit-listener');
                  }}
                />
              </>
            )}
            {/* <IconTextButton
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
            /> */}
          </HeaderButtonWrapper>
        )}
      </Left>
    </Container>
  );
};

const LogoWrapper = styled.span`
  width: fit-content;
  height: fit-content;
  cursor: pointer;
`;

const Container = styled.header<{ $isPc: boolean; $pathName: string }>`
  width: 100%;
  display: flex;
  background-color: ${({ $pathName }) =>
    $pathName != `/login` && $pathName != `/signup`
      ? '#121312'
      : 'transparent'};
  justify-content: space-between;
  z-index: 1;
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
