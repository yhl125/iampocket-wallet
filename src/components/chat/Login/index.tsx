import { Client, WalletType } from '@web3mq/client';

import { LoginBgcIcon, LoginCenterIcon } from '../icons';

import useLogin from '@/hooks/chat/useLogin';
import { useEffect, useState } from 'react';
import AddressStore from '@/store/AddressStore';
import { useSnapshot } from 'valtio';

import './index.css';
import { MainKeysType } from '@/utils/web3mq-utils';

interface IProps {
  fastUrl: string | null;
  keys?: MainKeysType;
  handleLoginEvent: any;
}

type LoginView = 'home' | 'reset_password' | 'login' | 'sign_up' | 'error';

export default function Login(props: IProps) {
  const [view, setView] = useState<LoginView>('home');
  const [password, setPassword] = useState<string>('');
  const { zeroDevAddress, pkpViemAddress, selectedWallet } = useSnapshot(
    AddressStore.state,
  );
  // function getCurrentAddress() {
  //   if (selectedWallet === 'zeroDev') return zeroDevAddress;
  //   else if (selectedWallet === 'pkpViem') return pkpViemAddress;
  //   else return zeroDevAddress;
  // }
  const { handleLoginEvent, keys, fastUrl } = props;

  const {
    // mainKeys,
    getUserAccount,
    // userAccount,
    // setMainKeys,
    // setUserAccount,
    login,
    register,
  } = useLogin({
    client: Client,
    keys,
    handleLoginEvent,
    // isResetPassword,
  });

  useEffect(() => {
    if (fastUrl) {
      const getAccount = async (didType?: WalletType, didValue?: string) => {
        const { address, userExist } = await getUserAccount(didType, didValue);
        if (address) {
          if (userExist) {
            if (!keys) {
              setView('reset_password');
            } else {
              setView('login');
            }
          } else {
            setView('sign_up');
          }
        } else {
          setView('error');
        }
      };
      getAccount('metamask', pkpViemAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fastUrl, pkpViemAddress]);

  const submitLogin = async (password: string) => {
    await login(password);
  };

  const submitSignUp = async (password: string) => {
    await register(password, false);
  };

  const submitResetPassword = async (password: string) => {
    await register(password, true);
  };

  return (
    <div className="login_container">
      <div className="test-bgc">
        <LoginBgcIcon />
      </div>
      <div className={'connectBtnBox'}>
        <LoginCenterIcon />
        <div className="connectBtnBoxTitle">Welcome to Web3MQ</div>
        <div className="connectBtnBoxText">
          Let&apos;s get started with your decentralized trip now!
        </div>
        <div className="walletConnect-btnBox">
          {view === 'sign_up' && (
            <>
              <input
                className="password_input"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => submitSignUp(password)}
              >
                Sign up
              </button>
            </>
          )}
          {view === 'login' && (
            <>
              <input
                className="password_input"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => submitLogin(password)}
              >
                Login
              </button>
            </>
          )}
          {view === 'reset_password' && (
            <>
              <input
                className="password_input"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => submitResetPassword(password)}
              >
                Reset password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
