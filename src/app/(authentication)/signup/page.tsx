'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthenticate from '@/hooks/useAuthenticate';
import useSession from '@/hooks/useSession';
import useAccounts from '@/hooks/useAccounts';
import {
  ORIGIN,
  registerWebAuthn,
  signInWithDiscord,
  signInWithGoogle,
} from '@/utils/lit';
import { AuthMethodType } from '@lit-protocol/constants';
import { LoadingWithCopy } from '@/components/Loading';
import PKPStore from '@/store/PKPStore';
import { useIsMounted } from '@/hooks/useIsMounted';
import SignUpMethods from '@/components/authentication/SignUpMethods';

export default function SignUpView() {
  const redirectUri = ORIGIN + '/signup';
  const mounted = useIsMounted();

  const {
    authMethod,
    authWithWebAuthn,
    // authWithStytch,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);
  const {
    createAccount,
    setCurrentAccount,
    currentAccount,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    initSession,
    sessionSigs,
    sessionSigsExpiration,
    loading: sessionLoading,
    error: sessionError,
  } = useSession();
  const router = useRouter();

  const error = authError || accountsError || sessionError;

  async function handleGoogleLogin() {
    await signInWithGoogle(redirectUri);
  }

  async function handleDiscordLogin() {
    await signInWithDiscord(redirectUri);
  }

  async function registerWithWebAuthn() {
    const newPKP = await registerWebAuthn();
    if (newPKP) {
      setCurrentAccount(newPKP);
    }
  }

  useEffect(() => {
    // If user is authenticated, create an account
    // For WebAuthn, the account creation is handled by the registerWithWebAuthn function
    if (authMethod && authMethod.authMethodType !== AuthMethodType.WebAuthn) {
      createAccount(authMethod);
    }
  }, [authMethod, createAccount, router]);

  useEffect(() => {
    // If user is authenticated and has at least one account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  useEffect(() => {
    // If user is authenticated and has selected an account, initialize session
    if (currentAccount && sessionSigs) {
      PKPStore.setAuthenticated(
        currentAccount,
        sessionSigs,
        sessionSigsExpiration!,
      );
      router.replace('/wallet');
    }
  }, [currentAccount, router, sessionSigs, sessionSigsExpiration]);

  if (authLoading) {
    return (
      <LoadingWithCopy
        copy={'Authenticating your credentials...'}
        error={error}
      />
    );
  }

  if (accountsLoading) {
    return <LoadingWithCopy copy={'Creating your account...'} error={error} />;
  }

  if (sessionLoading) {
    return <LoadingWithCopy copy={'Securing your session...'} error={error} />;
  }

  return (
    mounted && (
      <SignUpMethods
        handleGoogleLogin={handleGoogleLogin}
        handleDiscordLogin={handleDiscordLogin}
        registerWithWebAuthn={registerWithWebAuthn}
        authWithWebAuthn={authWithWebAuthn}
        // authWithStytch={authWithStytch}
        goToLogin={() => router.push('/login')}
        error={error}
      />
    )
  );
}
