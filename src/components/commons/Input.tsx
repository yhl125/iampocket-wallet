import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import Text from './Text';
import theme from '@/styles/theme';
import Button from './Button';

interface IInputProps {
  value: string | number;
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
  prefixComponent?: React.ReactElement; // TODO: left component (e.g. SearchInput)
  suffixComponent?: React.ReactElement; // right component (e.g. Button)
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
  prefixComponent,
  suffixComponent,
}: IInputProps) => {
  return (
    <Container>
      <InputWrapper size={size} className="input-wrapper">
        <Left>
          <PrefixContent>{prefixComponent}</PrefixContent>
          <StyledInput
            value={value}
            onChange={onChange}
            size={size}
            type={type}
            placeholder={placeholder}
            style={style}
          />
        </Left>
        <SuffixContent>{suffixComponent}</SuffixContent>
      </InputWrapper>
      {(error?.message || info?.message) && (
        <TextWrapper size={size}>
          <Text
            $thin
            size={size === 'medium' ? 'body3' : 'body4'}
            color={error?.message ? 'systemRed' : 'systemGreen'}
          >
            {error?.message ? error?.message : info?.message}
          </Text>
        </TextWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  row-gap: ${theme.space.xTiny};

  width: 100%;
  .input-wrapper:focus-within {
    border: 1px solid ${theme.color.brandBlue50};
  }
`;
const Left = styled.div`
  flex: 1;
`;
const PrefixContent = styled.div``;
const SuffixContent = styled.div`
  padding-right: ${theme.space.xTiny};
`;
const InputWrapper = styled.div<{ size: 'small' | 'medium' }>`
  transition: border-color 0.1s ease;
  padding-left: ${({ size }) =>
    size === 'medium' ? `${theme.space.sMedium}` : `${theme.space.small}`};

  height: ${({ size }) => (size === 'medium' ? '51px' : '40px')};

  border: 1px solid ${theme.color.bg50};
  border-radius: 5px;
  background-color: transparent;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const StyledInput = styled.input<{ size: 'small' | 'medium' }>`
  width: 100%;
  color: ${theme.color.bg0};
  font-size: ${({ size }) =>
    size === 'medium' ? theme.fontSize.body2 : theme.fontSize.body3};
  line-height: ${({ size }) =>
    size === 'medium' ? theme.lineHeight.body2 : theme.lineHeight.body3};

  &::placeholder {
    color: ${theme.color.bg20};
  }
`;

const TextWrapper = styled.div<{ size: 'small' | 'medium' }>`
  position: absolute;
  top: ${({ size }) => (size === 'medium' ? '55px' : '44px')};
`;

export default Input;
