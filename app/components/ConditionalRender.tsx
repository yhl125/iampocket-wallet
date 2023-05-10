import { ReactNode } from 'react';
import { Loading } from './Loading';

const Conditional = ({
  showWhen,
  children,
}: {
  showWhen: Boolean;
  children: ReactNode;
}) => {
  if (showWhen) return <>{children}</>;
  return <Loading></Loading>;
};

export default Conditional;
