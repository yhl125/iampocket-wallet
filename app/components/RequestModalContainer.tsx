import { ReactNode } from 'react';

/**
 * Types
 */
interface IProps {
  title: string;
  children: ReactNode;
}

/**
 * Component
 */
export default function RequestModalContainer({ children, title }: IProps) {
  return (
    <>
      <div className="modal-box">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        {children}
      </div>
    </>
  );
}
