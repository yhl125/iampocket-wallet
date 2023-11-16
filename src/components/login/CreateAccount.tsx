import styled from 'styled-components';

import Button from '../commons/Button';
import Text from '../commons/Text';
import theme from '@/styles/theme';

interface CreateAccountProp {
  signUp: any;
  error?: Error;
}

export default function CreateAccount({ signUp, error }: CreateAccountProp) {
  return (
    <Container>
      {error && (
        <div className="alert alert-error">
          <p>{error.message}</p>
        </div>
      )}
      <Text size="title1" $bold>
        Need a PKP?
      </Text>
      <Wrapper>
        <Text size="body2" color="bg20" $thin>
          There doesn&apos;t seem to be a Lit wallet associated with your
          credentials. Create one today.
        </Text>
        <Button text="Sign up" size="large" type="primary" onClick={signUp} />
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  padding-left: ${theme.space.medium};
  padding-right: ${theme.space.medium};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.sMedium};
  margin-top: ${theme.space.sMedium};
  margin-bottom: ${theme.space.tiny};
`;
