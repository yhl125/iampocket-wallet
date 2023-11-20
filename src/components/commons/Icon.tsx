import React from 'react';
import styled from 'styled-components';

import AddIcon from '@/assets/icons/plus.svg';
import LoginIcon from '@/assets/icons/login.svg';
import LogoIcon from '@/assets/icons/logo.svg';
import DiscordIcon from '@/assets/icons/discord.svg';
import FaceIdIcon from '@/assets/icons/faceid.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import FingerPrintIcon from '@/assets/icons/fingerprint.svg';
import MailIcon from '@/assets/icons/mail.svg';
import MobileIcon from '@/assets/icons/mobile.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import WalletIcon from '@/assets/icons/wallet.svg';
import TradeIcon from '@/assets/icons/trade.svg';
import ChatIcon from '@/assets/icons/chat.svg';
import SettingIcon from '@/assets/icons/setting.svg';
import LeftArrowIcon from '@/assets/icons/leftarrow.svg';
import DownArrowIcon from '@/assets/icons/downarrow.svg';
import CheckIcon from '@/assets/icons/check.svg';
import GasIcon from '@/assets/icons/gas.svg';

import theme, { ColorType, SizeType } from '@/styles/theme';

export type IconTypes =
  | 'add'
  | 'login'
  | 'logo'
  | 'discord'
  | 'faceid'
  | 'fingerprint'
  | 'google'
  | 'mail'
  | 'mobile'
  | 'menu'
  | 'wallet'
  | 'trade'
  | 'chat'
  | 'setting'
  | 'leftarrow'
  | 'downarrow'
  | 'check'
  | 'gas';

interface IProps {
  type: IconTypes;
  color?: ColorType;
  height?: SizeType | number;
}

const Icon = ({ type, height = 'body3', color = 'bg0' }: IProps) => {
  const renderIcon = () => {
    switch (type) {
      case 'add':
        return <AddIcon />;
      case 'login':
        return <LoginIcon />;
      case 'logo':
        return <LogoIcon />;
      case 'discord':
        return <DiscordIcon />;
      case 'fingerprint':
        return <FingerPrintIcon />;
      case 'faceid':
        return <FaceIdIcon />;
      case 'google':
        return <GoogleIcon />;
      case 'mail':
        return <MailIcon />;
      case 'mobile':
        return <MobileIcon />;
      case 'menu':
        return <MenuIcon />;
      case 'wallet':
        return <WalletIcon />;
      case 'trade':
        return <TradeIcon />;
      case 'chat':
        return <ChatIcon />;
      case 'setting':
        return <SettingIcon />;
      case 'leftarrow':
        return <LeftArrowIcon />;
      case 'downarrow':
        return <DownArrowIcon />;
      case 'check':
        return <CheckIcon />;
      case 'gas':
        return <GasIcon />;
    }
  };

  return (
    <Container height={height} color={color}>
      {renderIcon()}
    </Container>
  );
};

const Container = styled.div<{
  height: SizeType | number;
  color: ColorType;
}>`
  svg {
    width: ${({ height }) =>
      typeof height === 'number' ? `${height}px` : theme.fontSize[height]};
    height: ${({ height }) =>
      typeof height === 'number' ? `${height}px` : theme.fontSize[height]};
    path {
      fill: ${({ color }) => theme.color[color]};
      object-fit: contain;
    }
    circle {
      fill: ${({ color }) => theme.color[color]};
      object-fit: contain;
    }
  }
`;

export default Icon;
