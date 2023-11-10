import { useState } from 'react';
import styled from 'styled-components';

import EmailSMSAuth from '../login/EmailSMSAuth';
// import WalletMethods from './WalletMethods';
import WebAuthn from '../login/WebAuthn';
import Text from '../commons/Text';
import theme from '@/styles/theme';
import AuthMethods from './AuthMethods';
// import StytchOTP from './StytchOTP';

interface SignUpProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  // authWithEthWallet: any;
  authWithOTP: any;
  registerWithWebAuthn: any;
  authWithWebAuthn: any;
  authWithStytch: any;
  goToLogin: any;
  error?: Error;
}

export type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

export default function SignUpMethods({
  handleGoogleLogin,
  handleDiscordLogin,
  // authWithEthWallet,
  authWithOTP,
  registerWithWebAuthn,
  authWithWebAuthn,
  authWithStytch,
  goToLogin,
  error,
}: SignUpProps) {
  const [view, setView] = useState<AuthView>('default');

  return (
    <Container>
      {error && (
        <div className="alert alert-error">
          <p>{error.message}</p>
        </div>
      )}
      {view === 'default' && (
        <>
          <TitleWrapper>
            <Text size="title1" $bold>
              Sign Up
            </Text>
            <Text size="body2" $thin>
              Select Sign up method.
            </Text>
          </TitleWrapper>

          <SocialLoginWrapper>
            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              setView={setView}
            />
          </SocialLoginWrapper>
          <TextLinkButton onClick={goToLogin}>
            <Text size="body2" $thin>
              Have an account?
            </Text>
            &nbsp;
            <Text size="body3" color="brandBlue40">
              Sign in
            </Text>
          </TextLinkButton>
        </>
      )}
      {view === 'webauthn' && (
        <WebAuthn
          start={'register'}
          authWithWebAuthn={authWithWebAuthn}
          setView={setView}
          registerWithWebAuthn={registerWithWebAuthn}
        />
      )}
      {view === 'email' && (
        <EmailSMSAuth
          method={'email'}
          setView={setView}
          authWithOTP={authWithOTP}
        />
      )}
      {view === 'phone' && (
        <EmailSMSAuth
          method={'phone'}
          setView={setView}
          authWithOTP={authWithOTP}
        />
      )}
      {/* {view === 'phone' && (
          <StytchOTP authWithStytch={authWithStytch} setView={setView} />
        )} */}
      {/* {view === 'wallet' && (
          <WalletMethods
            authWithEthWallet={authWithEthWallet}
            setView={setView}
          />
        )} */}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 600px;

  padding-left: ${theme.space.medium};
  padding-right: ${theme.space.medium};
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.sMedium};
  margin-bottom: ${theme.space.xSmall};
`;

const SocialLoginWrapper = styled.div`
  margin-bottom: ${theme.space.medium};
`;

const TextLinkButton = styled.button`
  &:hover {
    span {
      text-decoration: underline;
    }
  }
`;
