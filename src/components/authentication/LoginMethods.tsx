import { useState } from 'react';
import styled from 'styled-components';
import EmailSMSAuth from '../login/EmailSMSAuth';
// import WalletMethods from './WalletMethods';
import WebAuthn from '../login/WebAuthn';
import theme from '@/styles/theme';
import Text from '../commons/Text';
import AuthMethods from './AuthMethods';
// import StytchOTP from './StytchOTP';

interface LoginProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  // authWithEthWallet: any;
  authWithOTP: any;
  authWithWebAuthn: any;
  authWithStytch: any;
  signUp: any;
  error?: Error;
}

type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

export default function LoginMethods({
  handleGoogleLogin,
  handleDiscordLogin,
  // authWithEthWallet,
  authWithOTP,
  authWithWebAuthn,
  authWithStytch,
  signUp,
  error,
}: LoginProps) {
  const [view, setView] = useState<AuthView>('default');

  return (
    <Container>
      <div>
        {error && (
          <div className="alert alert-error">
            <p>{error.message}</p>
          </div>
        )}
        {view === 'default' && (
          <>
            <TitleWrapper>
              <Text size="title1" $bold>
                Sign In
              </Text>
              <Text size="body2" color="bg20" $thin>
                Select Sign in method
              </Text>
            </TitleWrapper>
            <SocialLoginWrapper>
              <AuthMethods
                handleGoogleLogin={handleGoogleLogin}
                handleDiscordLogin={handleDiscordLogin}
                setView={setView}
              />
            </SocialLoginWrapper>
            <TextLinkButton onClick={signUp}>
              <Text size="body2" $thin>
                Need an iamPocket?
              </Text>
              &nbsp;
              <Text size="body3" color="brandBlue40">
                Sign Up
              </Text>
            </TextLinkButton>
          </>
        )}
        {view === 'webauthn' && (
          <WebAuthn
            start={'authenticate'}
            authWithWebAuthn={authWithWebAuthn}
            setView={setView}
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
      </div>
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
