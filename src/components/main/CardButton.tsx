'use client';

import theme from '@/styles/theme';
import React from 'react';
import styled from 'styled-components';
import Text from '../commons/Text';
import Icon, { IconTypes } from '../commons/Icon';

interface IProps {
  title: string;
  icon: IconTypes;
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  description?: string;
}
const CardButton = ({ title, icon, onClick, description }: IProps) => {
  return (
    <Container onClick={onClick}>
      <Icon type={icon} />
      <Text size="tiny" $thin>
        {description}
      </Text>
      <Text>{title}</Text>
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
  display: flex;
  padding: ${theme.space.medium};
  background-color: ${theme.color.backgroundPaper};

  border-radius: 5px;

  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.tiny};

  &:hover,
  &:active {
    background-color: ${theme.color.backgroundLight};
  }
`;

export default CardButton;
