import React from 'react';
import styled from 'styled-components';

import AddIcon from '@/assets/icons/plus.svg';
import LoginIcon from '@/assets/icons/login.svg';
import theme, { ColorType } from '@/styles/theme';

export type IconTypes = 'add' | 'login';

interface IProps {
  type: IconTypes;
  color?: ColorType;
  width?: number;
  height?: number;
}

const Icon = ({
  type,
  width = 24,
  height = 24,
  color = 'primaryMain',
}: IProps) => {
  const renderIcon = () => {
    switch (type) {
      case 'add':
        return <AddIcon />;
      case 'login':
        return <LoginIcon />;
    }
  };

  return (
    <Container width={width} height={height} color={color}>
      {renderIcon()}
    </Container>
  );
};

const Container = styled.div<{
  width: number;
  height: number;
  color: ColorType;
}>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};

  svg {
    path {
      fill: ${({ color }) => theme.color[color]};
    }
  }
`;

export default Icon;
