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
const RequestModalContainer = ({ children, title }: IProps) => {
  return (
    <>
      <div className="modal-box">
        <h3 className="mb-4 text-2xl font-bold">{title}</h3>
        {children}
      </div>
    </>
  );
};
export default RequestModalContainer;
