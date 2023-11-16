'use client';

import React from 'react';
import { ColorType, SizeType } from '@/styles/theme';
import Icon, { IconTypes } from './Icon';
import Button from './Button';

type IconButtonSizeType = 'large' | 'medium' | 'small';

interface IProps {
  text: string;
  icon: IconTypes;
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  type?: 'primary' | 'secondary';
  size?: IconButtonSizeType;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
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
  children,
}: IProps) => {
  const renderIconColor = (): ColorType => {
    if (disabled) return 'bg30';
    if (loading) return 'bg10';
    return 'bg0';
  };

  const renderIconSize = (): SizeType | number => {
    if (size === 'large') return 24;
    if (size === 'medium') return 20;
    return 16; // small
  };

  return (
    <Button
      text={text}
      type={type}
      onClick={onClick}
      size={size}
      style={style}
      disabled={disabled}
      loading={loading}
    >
      <Icon type={icon} color={renderIconColor()} height={renderIconSize()} />
      {children}
    </Button>
  );
};

export default IconButton;
