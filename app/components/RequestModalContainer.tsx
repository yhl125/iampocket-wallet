import { ReactNode } from 'react';

/**
 * Types
 */
interface IProps {
  title: string;
  children: ReactNode | ReactNode[];
}

/**
 * Component
 */
export default function RequestModalContainer({ children, title }: IProps) {
  return (
    <>
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        {children}
      </div>
    </>
  );
}
