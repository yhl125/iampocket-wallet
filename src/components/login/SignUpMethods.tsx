import { useState } from 'react';

import AuthMethods from './AuthMethods';
import WebAuthn from './WebAuthn';
// import StytchOTP from './StytchOTP';

interface SignUpProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  registerWithWebAuthn: any;
  authWithWebAuthn: any;
  // authWithStytch: any;
  goToLogin: any;
  error?: Error;
}

export type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

export default function SignUpMethods({
  handleGoogleLogin,
  handleDiscordLogin,
  registerWithWebAuthn,
  authWithWebAuthn,
  // authWithStytch,
  goToLogin,
  error,
}: SignUpProps) {
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
            <h1>Get started</h1>
            <p>
              Create a wallet that is secured by accounts you already have. With
              Lit-powered MPC wallets, you won&apos;t have to worry about seed
              phrases or browser extensions.
            </p>
            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              setView={setView}
            />
            <button
              type="button"
              className="btn relative mt-2 w-full normal-case"
              onClick={goToLogin}
            >
              Have an account? Log in
            </button>
          </>
        )}
        {/* {view === 'phone' && (
          <StytchOTP authWithStytch={authWithStytch} setView={setView} />
        )} */}
        {view === 'webauthn' && (
          <WebAuthn
            start={'register'}
            authWithWebAuthn={authWithWebAuthn}
            setView={setView}
            registerWithWebAuthn={registerWithWebAuthn}
          />
        )}
      </div>
    </div>
  );
}
