import { CodeBlock, codepen } from 'react-code-blocks';

/**
 * Types
 */
interface IProps {
  data: Record<string, unknown>;
}

/**
 * Component
 */
function RequestDataCard({ data }: IProps) {
  return (
    <>
      <h5>Data</h5>
      <CodeBlock
        {...codeBlockProps}
      />
    </>
  );
};
export default RequestDataCard;
