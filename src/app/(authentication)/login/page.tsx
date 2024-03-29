'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthenticate from '@/hooks/useAuthenticate';
import useSession from '@/hooks/useSession';
import useAccounts from '@/hooks/useAccounts';
import { ORIGIN, signInWithDiscord, signInWithGoogle } from '@/utils/lit';
import { LoadingWithCopy } from '@/components/Loading';
import LoginMethods from '@/components/authentication/LoginMethods';
import AccountSelection from '@/components/login/AccountSelection';
import CreateAccount from '@/components/login/CreateAccount';
import PKPStore from '@/store/PKPStore';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function LoginView() {
  const redirectUri = ORIGIN + '/login';
  const mounted = useIsMounted();
  const {
    authMethod,
    authWithWebAuthn,
    // authWithStytch,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);
  const {
    fetchAccounts,
    setCurrentAccount,
    currentAccount,
    accounts,
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

  useEffect(() => {
    // If user is authenticated, fetch accounts
    if (authMethod) {
      fetchAccounts(authMethod);
    }
  }, [authMethod, fetchAccounts]);

  useEffect(() => {
    // If user is authenticated and has selected an account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    } else if (authMethod && accounts.length === 1) {
      initSession(authMethod, accounts[0]);
    }
  }, [accounts, authMethod, currentAccount, initSession]);

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

  // If user is authenticated and has 1 account, immediately set current account rerender
  useEffect(() => {
    if (authMethod && accounts.length === 1 && sessionSigs) {
      PKPStore.setAuthenticated(
        accounts[0],
        sessionSigs,
        sessionSigsExpiration!,
      );
      router.replace('/wallet');
    }
  }, [authMethod, accounts, sessionSigs, sessionSigsExpiration, router]);

  if (authLoading) {
    return (
      <LoadingWithCopy
        copy={'Authenticating your credentials...'}
        error={error}
      />
    );
  }

  if (accountsLoading) {
    return (
      <LoadingWithCopy copy={'Looking up your accounts...'} error={error} />
    );
  }

  if (sessionLoading) {
    return <LoadingWithCopy copy={'Securing your session...'} error={error} />;
  }

  // If user is authenticated and has more than 1 account, show account selection
  if (authMethod && accounts.length > 1) {
    return (
      <AccountSelection
        accounts={accounts}
        setCurrentAccount={setCurrentAccount}
        error={error}
      />
    );
  }

  // If user is authenticated but has no accounts, prompt to create an account
  if (authMethod && accounts.length === 0) {
    return (
      <CreateAccount signUp={() => router.replace('/signup')} error={error} />
    );
  }
  // If user is not authenticated, show login methods
  return (
    mounted && (
      <LoginMethods
        handleGoogleLogin={handleGoogleLogin}
        handleDiscordLogin={handleDiscordLogin}
        authWithWebAuthn={authWithWebAuthn}
        // authWithStytch={authWithStytch}
        signUp={() => router.replace('/signup')}
        error={error}
      />
    )
  );
}
