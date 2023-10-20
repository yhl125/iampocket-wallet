'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import Text from './Text';
import theme, { ColorType, SizeType } from '@/styles/theme';
import Icon, { IconTypes } from './Icon';

type IcButtonSizeType = 'large' | 'medium' | 'small';

interface IProps {
    text: string;
    icon: IconTypes;
    type?: 'primary' | 'secondary' | 'tertiary';
    size?: IcButtonSizeType;
    onClick: (e?: React.MouseEvent<HTMLElement>) => void;
    disabled?: boolean;
    loading?: boolean;
    style?: React.CSSProperties;
}

const IcButton = ({
    text = '',
    icon,
    size = 'medium',
    type = 'primary',
    onClick = () => {},
    disabled = false,
    loading = false,
    style,
  }: IProps) => {
    const renderFontColor = (): ColorType => {
      if (disabled) return 'bg300';
      if (loading) return 'bg100';
      return 'bg0';
    };
  
    const renderButtonColor = (): ColorType => {
      if (disabled) return 'bg800';
  
      if (type === 'primary') {
        if (loading) return 'brandOrange600';
        return 'brandOrange500';
      }
  
      if (type === 'secondary') {
        if (loading) return 'brandBlue700';
        return 'brandBlue500';
      }
  
      if (type === 'tertiary') {
        if (loading) return 'bg300';
        return 'bg500';
      }
  
      return 'brandOrange500'; // default case
    };
  
    const renderFontSize = (): SizeType => {
      if (size === 'large') return 'body1';
      if (size === 'small') return 'body5';
      return 'body3'; // medium and default
    };

    // const renderIconSize = (): SizeType => {
    //   if (size === 'large') return 'body1';
    //   if (size === 'small') return 'body5';
    //   return 'body3'; // medium and default
    // };
  
    return (
      <Container
        color={renderButtonColor()}
        size={size}
        onClick={onClick}
        disabled={disabled}
        style={style}
      >
        <Icon type={icon} color={renderFontColor()} height={renderFontSize()} width={renderFontSize()}/>
        <Text color={renderFontColor()} size={renderFontSize()}>
          {text}
        </Text>
      </Container>
    );
  };

  const Container = styled.button<{
    color: ColorType;
    disabled: boolean;
    size: IcButtonSizeType;
  }>`
    cursor: pointer;
    background-color: ${({ color }) => theme.color[color]};
    padding: ${({ size }) =>
      size === 'small'
        ? `8px 10px`
        : size === 'medium'
        ? `12px 20px`
        : `16px 24px`};
  
    gap: ${({ size }) =>
    size === 'small' || 'medium'
    ? `4px`
    : `8px`};
  
    width: 100%;
    border-radius: 5px;
  
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  export default IcButton;


