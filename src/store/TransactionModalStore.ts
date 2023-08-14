import { proxy } from 'valtio';

interface TransacationModalData {
  hash: string;
  from: string;
  to?: string | undefined;
  value: string;
  tokenName?: string | undefined;
  network: string;
  amount?: string;
}

interface State {
  open: boolean;
  data: TransacationModalData;
}

const state = proxy<State>({
  open: false,
  data: {
    hash: '',
    from: '',
    to: undefined,
    value: '',
    tokenName: undefined,
    network: '',
    amount: '',
  },
});

const TransactionModalStore = {
  state,
  open(data: TransacationModalData) {
    state.open = true;
    state.data = data;
  },
  close() {
    state.open = false;
  },
};

export default TransactionModalStore;
