import styled from 'styled-components';

import Text from '../components/commons/Text';
import theme from '@/styles/theme';

export function Loading() {
  return (
    <div
      className="inline-block h-16 w-16 animate-spin rounded-full border-[8px] border-current border-t-transparent text-blue-600 dark:text-blue-500"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingSmall() {
  return (
    <div
      className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600 dark:text-blue-500"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingProps {
  copy: string;
  error?: Error;
}

export function LoadingWithCopy({ copy, error }: LoadingProps) {
  return (
    <Container>
      {error && (
        <div className="alert alert-error">
          <p>{error.message}</p>
        </div>
      )}
      <div
        className="inline-block h-16 w-16 animate-spin rounded-full border-[8px] border-current border-t-transparent text-blue-600 dark:text-blue-500"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <Text size="title3" color="bg20">
        {copy}
      </Text>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: ${theme.space.small};
`;
