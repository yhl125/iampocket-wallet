import React from 'react';
import styled from 'styled-components';

import theme from '@/styles/theme';
import Icon from './Icon';

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
    <Container>
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
    </Container>
  );
};

const Container = styled.div``;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.label<{ checkState: boolean }>`
  background: ${({ checkState }) =>
    checkState ? `${theme.color.brandBlue50}` : `${theme.color.bg90}`};
  border: ${({ checkState }) =>
    checkState ? `none` : `  1px solid ${theme.color.bg50};`};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border-radius: 50%;
  width: 24px;
  height: 24px;
`;

export default CheckBox;
