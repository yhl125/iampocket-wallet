'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import theme, { ColorType, SizeType } from '@/styles/theme';
import Icon, { IconTypes } from './Icon';
import Button from './Button';

type IconButtonSizeType = 'large' | 'medium' | 'small';

interface IProps {
    text: string;
    icon: IconTypes;
    type?: 'primary' | 'secondary' | 'tertiary';
    size?: IconButtonSizeType;
    onClick: (e?: React.MouseEvent<HTMLElement>) => void;
    disabled?: boolean;
    loading?: boolean;
    style?: React.CSSProperties;
}

const IconButton = ({
    text = '',
    icon,
    size = 'medium',
    type = 'primary',
    onClick = () => {},
    disabled = false,
    loading = false,
    style,
  }: IProps) => {

    const renderIconColor = (): ColorType => {
      if (disabled) return 'bg300';
      if (loading) return 'bg100';
      return 'bg0';
    };
  
    const renderIconSize = (): SizeType => {
      if (size === 'large') return 'body1';
      if (size === 'small') return 'body5';
      return 'body3'; // medium and default
    };
  
    return (
      <Button
      text={text}
      type={type}
      onClick={onClick}
      size={size}
      style={style}
      >
        <Icon type={icon} color={renderIconColor()} height={renderIconSize()}/>
      </Button>
    );
  };

  export default IconButton;


