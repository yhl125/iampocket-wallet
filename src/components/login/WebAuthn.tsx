import { useState } from 'react';
import styled from 'styled-components';

import { AuthView } from './SignUpMethods';
import theme from '@/styles/theme';
import Text from '../commons/Text';
import Button from '../commons/Button';
import IconTextButton from '../commons/IconTextButton';
import { LoadingWithCopy } from '@/components/Loading';

type WebAuthnStep = 'register' | 'authenticate';

interface WebAuthnProps {
  start: WebAuthnStep;
  authWithWebAuthn: any;
  setView: React.Dispatch<React.SetStateAction<AuthView>>;
  registerWithWebAuthn?: any;
}

export default function WebAuthn({
  start,
  authWithWebAuthn,
  setView,
  registerWithWebAuthn,
}: WebAuthnProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [step, setStep] = useState<WebAuthnStep>(start);

  async function handleRegister() {
    setError(undefined);
    setLoading(true);
    try {
      await registerWithWebAuthn();
      setStep('authenticate');
    } catch (err: any) {
      console.error(err);
      setError(err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <LoadingWithCopy
        copy={'Follow the prompts to continue...'}
        error={error}
      />
    );
  }

  return (
    <>
      {error && (
        <div className="alert alert-error">
          <p>{error.message}</p>
        </div>
      )}

      {step === 'register' && (
        <>
          <Text size="title1" $bold>
            Sign Up with Webauthn
          </Text>
          <WebAuthWrapper>
            <Text size="body2" color="bg20" $thin>
              Register with an authenticator. <br /> WebAuthn credentials enable
              simple and secure passwordless authentication.
            </Text>
            <Button
              text="Create a Credential"
              size="large"
              type="primary"
              onClick={handleRegister}
            />
          </WebAuthWrapper>
        </>
      )}
      {step === 'authenticate' && (
        <>
          <Text size="title1" $bold>
            Sign In with Webauthn
          </Text>
          <WebAuthWrapper>
            <Text size="body2" color="bg20" $thin>
              Authenticate with your authenticator.
              <br /> Sign in using your authenticator
            </Text>

            <Button
              text="Sign in with authenticator"
              size="large"
              type="primary"
              onClick={authWithWebAuthn}
            />
          </WebAuthWrapper>
        </>
      )}
      <ButtonWrapper>
        <IconTextButton
          text="Back"
          size="small"
          icon="leftarrow"
          onClick={() => setView('default')}
        />
      </ButtonWrapper>
    </>
  );
}

const ButtonWrapper = styled.div`
  margin-top: ${theme.space.large};
`;

const WebAuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.sMedium};
  margin-top: ${theme.space.sMedium};
  margin-bottom: ${theme.space.tiny};
`;
