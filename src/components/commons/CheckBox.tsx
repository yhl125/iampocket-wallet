'use client';

import React, { ChangeEventHandler, useState } from 'react';
import styled from 'styled-components';

import theme, { ColorType, SizeType } from '@/styles/theme';
import Text from './Text';
import Icon, { IconTypes } from './Icon';

interface IProps {
  disabled?: boolean;
  checkState: boolean;
  setCheckState: React.Dispatch<React.SetStateAction<boolean>>;
}
const CheckBox = ({
  disabled = false,
  checkState = false,
  setCheckState,
}: IProps) => {
  return (
    <CheckboxWrapper>
      <HiddenCheckbox
        type="checkbox"
        id="checkBoxId"
        checked={checkState}
        onChange={() => {
          setCheckState(!checkState);
        }}
      />
      <StyledCheckbox htmlFor="checkBoxId" checkState={checkState}>
        {checkState ? <Icon type="check" color="bg0" height="body1" /> : null}
      </StyledCheckbox>
    </CheckboxWrapper>
  );
};

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.label<{ checkState: boolean }>`
  background: ${({ checkState }) =>
    checkState ? `${theme.color.brandBlue50}` : `${theme.color.bg90}`};
  border: ${({ checkState }) =>
    checkState ? `none` : `  1px solid ${theme.color.bg50};`};

  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border-radius: 50%;
  width: 24px;
  height: 24px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  margin-left: 8px;
`;

export default CheckBox;
