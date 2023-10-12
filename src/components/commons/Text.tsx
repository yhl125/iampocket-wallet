import React, { CSSProperties } from 'react';
import CSS from 'csstype';
import styled from 'styled-components';

import theme, { ColorType, SizeType } from '@/styles/theme';

interface IProps {
  children: React.ReactNode;
  color?: ColorType;
  size?: SizeType;
  $align?: CSS.Property.TextAlign;
  $bold?: boolean;
  $thin?: boolean;
  style?: CSSProperties;
  className?: string;
}

const Text = ({
  children = '',
  color = 'textPrimary',
  size = 'body3',
  $bold = false,
  $thin = false,
  $align = 'left',
  className = '',
  ...rest
}: IProps) => {
  return (
    <StyledText
      className=""
      $align={$align}
      color={color}
      size={size}
      $bold={$bold}
      $thin={$thin}
    >
      {children}
    </StyledText>
  );
};

const StyledText = styled.span<IProps>`
  font-weight: ${({ $bold, $thin }) => ($bold ? 700 : $thin ? 400 : 500)};
  color: ${({ color }) => theme.color[color ?? 'textPrimary']};
  font-size: ${({ size }) => theme.fontSize[size ?? 'body3']};
  line-height: ${({ size }) => theme.lineHeight[size ?? 'body3']};
  text-align: ${({ $align }) => $align};
`;

export default Text;
