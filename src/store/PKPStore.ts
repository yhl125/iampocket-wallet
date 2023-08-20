import { SessionSigs } from '@lit-protocol/types';
import { proxyWithLocalStorage } from '@/utils/StoreUtil';
import { IRelayPKP } from '@lit-protocol/types';

/**
 * Types
 */
interface PKPState {
  isAuthenticated: boolean;
  currentPKP?: IRelayPKP;
  sessionSigs?: SessionSigs;
  sessionExpiration?: Date;
}

/**
 * State
 */
const state = proxyWithLocalStorage<PKPState>('PKPState', {
  isAuthenticated: false,
  currentPKP: undefined,
  sessionSigs: undefined,
  sessionExpiration: undefined,
});

/**
 * Store / Actions
 */
const PKPStore = {
  state,
  setPKP(pkp: IRelayPKP) {
    state.currentPKP = pkp;
  },

  setAuthenticated(
    pkp: IRelayPKP,
    sessionSigs: SessionSigs,
    sessionExpiration: Date,
  ) {
    state.isAuthenticated = true;
    state.currentPKP = pkp;
    state.sessionSigs = sessionSigs;
    state.sessionExpiration = sessionExpiration;
  },

  setUnauthenticated() {
    state.isAuthenticated = false;
    state.currentPKP = undefined;
    state.sessionSigs = undefined;
    state.sessionExpiration = undefined;
  },
};

export default PKPStore;
