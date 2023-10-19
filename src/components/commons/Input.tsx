import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import Text from './Text';
import theme from '@/styles/theme';

interface IInputProps {
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute;
  size?: 'small' | 'large';
  error?: {
    message?: string;
  };
  info?: {
    message: string;
  };
  placeholder?: string;
  style?: React.CSSProperties;
}

const Input = ({
  value,
  onChange,
  type = 'text',
  size = 'small',
  error = undefined,
  info = undefined,
  placeholder,
  style,
}: IInputProps) => {
  return (
    <InputContainer>
      <StyledInput
        value={value}
        onChange={onChange}
        size={size}
        type={type}
        placeholder={placeholder}
        style={style}
        maxLength={15}
      />
      {(error?.message || info?.message) && (
        <Text
          $thin
          size={size === 'large' ? 'body2' : 'body4'}
          color={error?.message ? 'systemRed' : 'systemGreen'}
        >
          {error?.message ? error?.message : info?.message}
        </Text>
      )}
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

  row-gap: ${theme.space.tiny};

  width: 100%;
`;
const StyledInput = styled.input<{ size: 'small' | 'large' }>`
  transition: border-color 0.1s ease;
  padding: ${({ size }) =>
    size === 'large' ? `21px` : `${theme.space.xSmall} ${theme.space.sMedium}`};

  background-color: ${theme.color.bg500};
  border: 1px solid ${theme.color.bg500};
  border-radius: 5px;

  color: ${theme.color.bg0};
  font-size: ${({ size }) =>
    size === 'large' ? theme.fontSize.title3 : theme.fontSize.body3};
  line-height: ${({ size }) =>
    size === 'large' ? theme.lineHeight.title3 : theme.lineHeight.body3};

  &::placeholder {
    color: ${theme.color.bg200};
  }

  &:focus {
    border: 1px solid ${theme.color.bg0};
  }
`;

export default Input;
