import { ReactNode } from 'react';
import styled from 'styled-components';

function Conditional({
  showWhen,
  children,
}: {
  showWhen: Boolean;
  children: ReactNode;
}) {
 return <ConditionalWrapper showWhen>{children}</ConditionalWrapper>;
}

const ConditionalWrapper = styled.div<{ showWhen: boolean }>`
  transition: opacity 0.7s ease;
  opacity: ${({ showWhen }) => (showWhen ? 1 : 0.2)};
  pointer-events: ${({ showWhen }) => (showWhen ? `auto` : `none`)};
`;
export default Conditional;
