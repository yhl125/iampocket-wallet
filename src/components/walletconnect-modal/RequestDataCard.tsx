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
  const codeBlockProps = {
    text: JSON.stringify(data, null, 2),
    language: 'json',
    showLineNumbers: false,
    theme: codepen,
  };
  return (
    <>
      <h5>Data</h5>
      <CodeBlock {...codeBlockProps} />
    </>
  );
}

export default RequestDataCard;
