'use client';

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Text from './Text';
import theme, { ColorType, SizeType } from '@/styles/theme';

type ButtonSizeType = 'large' | 'medium' | 'small';
interface IProps {
  children?: React.ReactNode;
  text: string;
  type?: 'primary' | 'secondary';
  size?: ButtonSizeType;
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  loading?: boolean; // is loading props useable?
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
    if (disabled) {
      if (type === 'primary') return 'bg30';
      if (type === 'secondary') return 'bg50';
    }

    return 'bg0';
  };

  const renderButtonColor = (): ColorType => {
    if (type === 'primary') {
      if (disabled) return 'bg50';
      if (loading) return 'brandBlue80';
      if (hover) return 'brandBlue60';
      return 'brandBlue50';
    }

    if (type === 'secondary') {
      if (disabled) return 'transparent';
      if (loading) return 'bg80';
      if (hover) return 'bg70';
      return 'transparent'; // default
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
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      $fontColor={renderFontColor()}
    >
      {children}
      <StyledText text={text} color={renderFontColor()} size={renderFontSize()}>
        {text}
      </StyledText>
    </Container>
  );
};

const Container = styled.button<{
  color: ColorType;
  disabled: boolean;
  size: ButtonSizeType;
  $fontColor: ColorType;
  type: 'primary' | 'secondary';
}>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ color }) => theme.color[color]};
  padding: ${({ size }) =>
    size === 'small'
      ? `12px 12px`
      : size === 'medium'
      ? `16px 24px`
      : `16px 32px`};

  gap: 4px;

  width: 100%;
  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;

  /* MEMO: for the icon button hover effect */
  svg {
    path {
      fill: ${({ $fontColor }) => theme.color[$fontColor]};
    }
  }

  ${({ type }) =>
    type === 'secondary' &&
    css`
      border: 1px solid ${theme.color.bg50};
    `}
`;

const StyledText = styled(Text)<{text:string}>`
  display: ${({ text }) => text === ""&& `none`};
`;

export default Button;
