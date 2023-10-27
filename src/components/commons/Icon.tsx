import React from 'react';
import styled from 'styled-components';

import AddIcon from '@/assets/icons/plus.svg';
import LoginIcon from '@/assets/icons/login.svg';
import LogoIcon from '@/assets/icons/logo.svg';
import theme, { ColorType, SizeType } from '@/styles/theme';

export type IconTypes = 'add' | 'login' | 'logo';

interface IProps {
  type: IconTypes;
  color?: ColorType;
  height?: SizeType;
}

const Icon = ({ type, height = 'body3', color = 'bg0' }: IProps) => {
  const renderIcon = () => {
    switch (type) {
      case 'add':
        return <AddIcon />;
      case 'login':
        return <LoginIcon />;
      case 'logo':
        return <LogoIcon />;
    }
  };

  return (
    <Container height={height} color={color}>
      {renderIcon()}
    </Container>
  );
};

const Container = styled.div<{
  height: SizeType;
  color: ColorType;
}>`
  svg {
    height: ${({ height }) => theme.fontSize[height]};
    path {
      fill: ${({ color }) => theme.color[color]};
      object-fit: contain;
    }
  }
`;

export default Icon;
