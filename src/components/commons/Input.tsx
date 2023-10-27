import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import Text from './Text';
import theme from '@/styles/theme';

interface IInputProps {
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute;
  size?: 'small' | 'medium';
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
          size={size === 'medium' ? 'body2' : 'body4'}
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
const StyledInput = styled.input<{ size: 'small' | 'medium' }>`
  transition: border-color 0.1s ease;
  padding: ${({ size }) =>
    size === 'medium'
      ? `${theme.space.xSmall} ${theme.space.sMedium}`
      : `${theme.space.tiny} ${theme.space.small}`};

  background-color: ${theme.color.bg80};
  border: 1px solid ${theme.color.bg80};
  border-radius: 5px;

  color: ${theme.color.bg0};
  font-size: ${({ size }) =>
    size === 'medium' ? theme.fontSize.body2 : theme.fontSize.body3};
  line-height: ${({ size }) =>
    size === 'medium' ? theme.lineHeight.body2 : theme.lineHeight.body3};

  &::placeholder {
    color: ${theme.color.bg20};
  }

  &:focus {
    border: 1px solid ${theme.color.brandBlue50};
  }
`;

export default Input;
