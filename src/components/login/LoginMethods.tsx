import { useState } from 'react';

import AuthMethods from './AuthMethods';
import WebAuthn from './WebAuthn';
import { AuthView } from './SignUpMethods';
// import StytchOTP from './StytchOTP';

interface LoginProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  authWithWebAuthn: any;
  // authWithStytch: any;
  signUp: any;
  error?: Error;
}

export default function LoginMethods({
  handleGoogleLogin,
  handleDiscordLogin,
  authWithWebAuthn,
  // authWithStytch,
  signUp,
  error,
}: LoginProps) {
  const [view, setView] = useState<AuthView>('default');

  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert-error">
            <p>{error.message}</p>
          </div>
        )}
        {view === 'default' && (
          <>
            <h1>Welcome back</h1>
            <p>Access your Lit wallet.</p>
            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              setView={setView}
            />
            <button
              type="button"
              className="btn relative mt-2 w-full normal-case"
              onClick={signUp}
            >
              Need an account? Sign up
            </button>
          </>
        )}
        {/* {view === 'phone' && (
          <StytchOTP authWithStytch={authWithStytch} setView={setView} />
        )} */}
        {view === 'webauthn' && (
          <WebAuthn
            start={'authenticate'}
            authWithWebAuthn={authWithWebAuthn}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
}
