'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Text from './Text';
import theme, { ColorType } from '@/styles/theme';

interface IProps {
  text: string;
  onClick: () => void;
  size: 'large' | 'medium' | 'small';
  children: React.ReactNode;
  disabled?: boolean;
}

const TextButton = ({
  text = '',
  onClick,
  size = 'medium',
  children,
  disabled = false,
}: IProps) => {
  const [hover, setHover] = useState(false);
  const getTextSize = () => {
    switch (size) {
      case 'large':
        return 'body1';
      case 'medium':
        return 'body2';
      case 'small':
      default:
        return 'body3';
    }
  };

  const renderFontColor = (): ColorType => {
    if (disabled) return 'bg60';
    if (hover) return 'bg0';
    return 'bg30';
  };

  return (
    <Container
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      fontColor={renderFontColor()}
    >
      {children}
      <StyledText
        text={text}
        size={getTextSize()}
        color={disabled ? 'bg60' : 'bg30'}
        disabled={disabled}
      >
        {text}
      </StyledText>
    </Container>
  );
};

const Container = styled.button<{
  disabled: boolean;
  fontColor: ColorType;
}>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'cursor')};

  gap: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  /* MEMO: for the icon button hover effect */
  div {
    svg {
      path {
        fill: ${({ fontColor }) => theme.color[fontColor]};
      }
    }
  }
`;
const StyledText = styled(Text)<{ disabled: boolean; text: string }>`
  display: ${({ text }) => text === '' && `none`};
  &:hover {
    color: ${({ disabled }) => (disabled ? theme.color.bg60 : theme.color.bg0)};
  }
`;

export default TextButton;
