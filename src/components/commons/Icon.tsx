import React from 'react';
import styled from 'styled-components';

import AddIcon from '@/assets/icons/plus.svg';
import LoginIcon from '@/assets/icons/login.svg';
import theme, { ColorType, SizeType } from '@/styles/theme';

export type IconTypes = 'add' | 'login';

interface IProps {
  type: IconTypes;
  color?: ColorType;
  height?: SizeType;
  width?: SizeType;
}

const Icon = ({
  type,
  height = 'body3',
  width = 'body3',
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
  width : SizeType;
  height: SizeType;
  color: ColorType;
}>`
  width:  ${({ width }) => theme.fontSize[width]};;
  height: ${({ height }) => theme.fontSize[height]};


  svg {
    path {
      fill: ${({ color }) => theme.color[color]};
       object-fit: contain;
    }
  }
`;

export default Icon;
