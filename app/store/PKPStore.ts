import { proxy, subscribe } from 'valtio';
import { AuthSig } from '@lit-protocol/types';

/**
 * Types
 */
interface PKPState {
  isAuthenticated: boolean;
  currentUsername?: string;
  currentPKP?: PKP;
  // sessionSigs: SessionSigsMap;
  sessionExpiration?: string;
  authSig?: AuthSig;
}

interface PKP {
  tokenId: string;
  publicKey: string;
  ethAddress: string;
}

/**
 * State
 */
const state = proxy<PKPState>(
  localStorage.getItem('PKPState')
    ? JSON.parse(localStorage.getItem('PKPState')!)
    : {
        isAuthenticated: false,
        currentUsername: undefined,
        currentPKP: undefined,
        // sessionSigs: {},
        sessionExpiration: undefined,
        authSig: undefined,
      }
);


subscribe(state, () => {
  localStorage.setItem('PKPState', JSON.stringify(state));
});
/**
 * Store / Actions
 */
const PKPStore = {
  state,
  setPKP(pkp: PKP) {
    state.currentPKP = pkp;
  },

  setAuthenticated(
    username: string,
    pkp: PKP,
    // sessionSigs: SessionSigsMap,
    sessionExpiration: string,
    authSig: AuthSig
  ) {
    state.isAuthenticated = true;
    state.currentUsername = username;
    state.currentPKP = pkp;
    // state.sessionSigs = sessionSigs;
    state.sessionExpiration = sessionExpiration;
    state.authSig = authSig;
  },

  setUnauthenticated() {
    state.isAuthenticated = false;
    state.currentUsername = undefined;
    state.currentPKP = undefined;
    // state.sessionSigs = {};
    state.sessionExpiration = undefined;
    state.authSig = undefined;
  },
};

export default PKPStore;
