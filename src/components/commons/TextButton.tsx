'use client';

import styled from 'styled-components';
import Text from './Text';
import theme from '@/styles/theme';

interface IProps {
  onClick: () => void;
  size: 'large' | 'medium' | 'small';
  children: React.ReactNode;
  disabled?: boolean;
}

const TextButton = ({ onClick, size, children, disabled = false }: IProps) => {
  const getTextSize = () => {
    switch (size) {
      case 'large':
        return 'body1';
      case 'medium':
        return 'body2';
      case 'small':
      default:
        return 'body3';
    }
  };

  return (
    <Container
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
    >
      <StyledText
        size={getTextSize()}
        color={disabled ? 'bg60' : 'bg30'}
        disabled={disabled}
      >
        {children}
      </StyledText>
    </Container>
  );
};

const Container = styled.button<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'cursor')};
`;
const StyledText = styled(Text)<{ disabled: boolean }>`
  &:hover {
    color: ${({ disabled }) => (disabled ? theme.color.bg60 : theme.color.bg0)};
  }
`;

export default TextButton;
