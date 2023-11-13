'use client';

import React from 'react';
import { SizeType } from '@/styles/theme';
import Icon, { IconTypes } from './Icon';
import TextButton from './TextButton';

interface IProps {
  text: string;
  size: 'large' | 'medium' | 'small';
  icon: IconTypes;
  onClick: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  height?: SizeType | number;
}

const IconTextButton = ({
  text = '',
  size = 'medium',
  icon,
  onClick = () => {},
  disabled = false,
  children,
}: IProps) => {
  const renderIconSize = (): SizeType | number => {
    if (size === 'large') return 24;
    if (size === 'medium') return 20;
    return 16; // small
  };

  return (
    <TextButton text={text} onClick={onClick} size={size}>
      <Icon
        type={icon}
        color={disabled ? 'bg60' : 'bg30'}
        height={renderIconSize()}
      />
      {children}
    </TextButton>
  );
};

export default IconTextButton;
