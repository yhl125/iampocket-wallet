import { CoreTypes } from '@walletconnect/types';
import { proxyWithLocalStorage } from '@/utils/StoreUtil';

/**
 * Types
 */
interface State {
  connectedApps: ConnectedApp[];
}

interface ConnectedApp {
  topic: string;
  expiry: Date;
  metadata: CoreTypes.Metadata;
}

export interface ReadOnlyConnectedApp {
  readonly topic: string;
  readonly expiry: Date;
  readonly metadata: {
    readonly name: string;
    readonly description: string;
    readonly url: string;
    readonly icons: readonly string[];
  };
}

/**
 * State
 */
const state = proxyWithLocalStorage<State>('ConnectedAppState', { connectedApps: [] });


/**
 * Store / Actions
 */
const ConnectedAppStore = {
  state,
  addConnectedApp(topic: string, expiry: Date, metadata: CoreTypes.Metadata) {
    state.connectedApps.push({ topic, expiry, metadata });
  },
  disconnectApp(topic: string) {
    state.connectedApps = state.connectedApps.filter(
      (app) => app.topic !== topic
    );
  },
  removeExpiredApps() {
    state.connectedApps = state.connectedApps.filter(
      (app) => app.expiry > new Date()
    );
  },
};

export default ConnectedAppStore;
