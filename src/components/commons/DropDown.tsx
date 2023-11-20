'use client';

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';

import theme, { ColorType, SizeType } from '@/styles/theme';
import Text from './Text';
import Icon, { IconTypes } from './Icon';

interface IProps {
  size?: 'medium' | 'small';
  disabled?: boolean;
  selectContentState: any;
  setSelectContentState: React.Dispatch<React.SetStateAction<any>>;
  iconKey: string;
  nameKey: string;

  contents: any[];
}
const DropDown = ({
  size = 'medium',
  selectContentState,
  disabled = false,
  setSelectContentState,
  iconKey = '',
  nameKey = '',
  contents = [],
}: IProps) => {
  
  const [isDropDownShowed, setIsDropDownShowed] = useState<boolean>(false);

  if (contents.length ===0){
    disabled =true
  }

  const handleContentClick = (content: any) => {
    setSelectContentState(content);
    setIsDropDownShowed(!isDropDownShowed);
  };
  const renderFontColor = (): ColorType => {
    if (isDropDownShowed) return 'bg0';
    if (disabled) return 'bg50';
    return 'bg20';
  };

  const renderBorderColor = (): ColorType => {
    if (isDropDownShowed) return 'bg30';
    if (disabled) return 'bg50';
    return 'bg0';
  };

  const renderArrowColor = (): ColorType => {
    if (isDropDownShowed) return 'brandBlue50';
    if (disabled) return 'bg50';
    return 'brandBlue60';
  };

  return (
    <Container size={size}>
      <DropDownButton
        size={size}
        isDropDownShowed={isDropDownShowed}
        disabled={disabled}
        onClick={() => {
          setIsDropDownShowed(!isDropDownShowed);
        }}
      >
        <ContentWrapper>
          <Image
            src={selectContentState[iconKey]}
            width={20}
            height={20}
            alt={'chain logo'}
            className="mask mask-circle"
          ></Image>
          <Text
            color={renderFontColor()}
            size={size === 'medium' ? 'body2' : 'body3'}
          >
            {selectContentState.name}
          </Text>
        </ContentWrapper>

        <Icon
          type="downarrow"
          color={renderArrowColor()}
          height={size === 'medium' ? 'body3' : 'body4'}
        />
      </DropDownButton>
      <DropDownContents isDropDownShowed={isDropDownShowed}>
        {contents.map((content, idx) => (
          <DropDownContent
            size={size}
            key={idx}
            onClick={() => handleContentClick(content)}
          >
            <ContentWrapper>
              <Image
                src={content[iconKey]}
                width={20}
                height={20}
                alt={'chain logo'}
                className="mask mask-circle"
              ></Image>
              <Text
                color={renderFontColor()}
                size={size === 'medium' ? 'body2' : 'body3'}
              >
                {content[nameKey]}
              </Text>
            </ContentWrapper>
          </DropDownContent>
        ))}
      </DropDownContents>
    </Container>
  );
};

const Container = styled.div<{ size: 'small' | 'medium' }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: ${({ size }) => (size === 'medium' ? '180px' : '150px')};
  position: relative;
`;

const DropDownButton = styled.button<{
  size: 'small' | 'medium';
  isDropDownShowed: boolean;
  disabled: boolean;
}>`
  padding: ${({ size }) =>
    size === 'medium'
      ? `14px ${theme.space.sMedium}`
      : `9px ${theme.space.xSmall}`};

  border: ${({ isDropDownShowed }) =>
    isDropDownShowed
      ? `1px solid ${theme.color.brandBlue50};`
      : `1px solid ${theme.color.bg50};`};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border-radius: 5px;
  background-color: ${theme.color.bg90};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  gap: ${theme.space.xSmall};
  display: flex;
  align-items: center;
`;

const DropDownContents = styled.div<{
  isDropDownShowed: boolean;
}>`
  background-color: ${theme.color.bg80};

  transition: opacity 0.4s ease;
  opacity: ${({ isDropDownShowed }) => (isDropDownShowed ? 1 : 0)};
  flex: ${({ isDropDownShowed }) => (isDropDownShowed ? `flex` : `none`)};
  pointer-events: ${({ isDropDownShowed }) =>
    isDropDownShowed ? `auto` : `none`};
  position: absolute;
  top: 59px;
  width: 100%;
  border-radius: 5px;
`;

const DropDownContent = styled.div<{ size: 'small' | 'medium' }>`
  padding: ${({ size }) =>
    size === 'medium'
      ? `${theme.space.small} ${theme.space.sMedium}`
      : `${theme.space.xSmall} ${theme.space.xSmall}`};

  &:hover {
    background-color: ${theme.color.bg90};
  }

  border-radius: 5px;
`;

export default DropDown;
