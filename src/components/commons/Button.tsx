'use client';

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Text from './Text';
import theme, { ColorType, SizeType } from '@/styles/theme';

type ButtonSizeType = 'large' | 'medium' | 'small';
interface IProps {
  children?: React.ReactNode;
  text: string;
  type?: 'primary' | 'secondary' | 'tertiary';
  size?: ButtonSizeType;
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
}
const Button = ({
  children,
  text = '',
  size = 'medium',
  type = 'primary',
  onClick = () => {},
  disabled = false,
  loading = false,
  style,
}: IProps) => {
  const [hover, setHover] = useState(false);
  const renderFontColor = (): ColorType => {
    if (disabled) return 'bg30';
    if (loading) return 'bg10';
    if (hover && type === 'secondary') {
      return 'bg30';
    }
    return 'bg0';
  };

  const renderButtonColor = (): ColorType => {
    if (disabled) return 'bg50';

    if (type === 'primary') {
      if (loading) return 'brandBlue80';
      if (hover) return 'brandBlue60';
      return 'brandBlue50';
    }

    if (type === 'secondary') {
      if (loading) return 'bg50';
      return 'bg100';
    }

    if (type === 'tertiary') {
      if (loading) return 'bg50';
      if (hover) return 'bg60';
      return 'bg80';
    }

    return 'brandBlue50';
  };

  const renderFontSize = (): SizeType => {
    if (size === 'large') return 'body1';
    if (size === 'small') return 'body3';
    return 'body2';
  };

  return (
    <Container
      color={renderButtonColor()}
      size={size}
      onClick={onClick}
      disabled={disabled}
      style={style}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      {children}
      <Text color={renderFontColor()} size={renderFontSize()} $bold>
        {text}
      </Text>
    </Container>
  );
};

const Container = styled.button<{
  color: ColorType;
  disabled: boolean;
  size: ButtonSizeType;
}>`
  cursor: pointer;
  background-color: ${({ color }) => theme.color[color]};
  padding: ${({ size }) =>
    size === 'small'
      ? `8px 12px`
      : size === 'medium'
      ? `12px 20px`
      : `16px 24px`};

  gap: ${({ size }) => (size === 'small' || 'medium' ? `4px` : `8px`)};

  width: 100%;
  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Button;
