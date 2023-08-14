/**
 * Types
 */
interface IProps {
  methods: string[];
}

/**
 * Component
 */
const RequestMethodCard = ({ methods }: IProps) => {
  return (
    <div>
      <h5>Methods</h5>
      <p>{methods.map((method) => method).join(', ')}</p>
    </div>
  );
};
export default RequestMethodCard;
