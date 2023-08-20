import Image from 'next/image';
import { AuthView } from './SignUpMethods';

interface AuthMethodsProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  setView: React.Dispatch<React.SetStateAction<AuthView>>;
}

const AuthMethods = ({
  handleGoogleLogin,
  handleDiscordLogin,
  setView,
}: AuthMethodsProps) => {
  return (
    <>
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            className="btn relative flex-grow normal-case"
            onClick={handleGoogleLogin}
          >
            <div className="avatar">
              <div className="w-8 rounded">
                <Image
                  src="/login-logos/google.png"
                  alt="Google logo"
                  fill
                ></Image>
              </div>
            </div>
            Google
          </button>
          <button
            className="btn relative flex-grow normal-case"
            onClick={handleDiscordLogin}
          >
            <div className="avatar">
              <div className="w-10 rounded">
                <Image
                  src="/login-logos/discord-square-color-icon.svg"
                  alt="Discord logo"
                  fill
                ></Image>
              </div>
            </div>
            Discord
          </button>
          {/* <button type="button" className="btn btn--outline">
            <div className="btn__icon">
              <Image src="/apple.png" alt="Apple logo" fill={true}></Image>
            </div>
            <span className="btn__label">Apple</span>
          </button> */}
        </div>
        <button
          className="btn relative flex-grow normal-case"
          onClick={() => setView('email')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          Continue with Email
        </button>
        <button
          className="btn relative flex-grow normal-case"
          onClick={() => setView('phone')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
            />
          </svg>
          Continue with SMS
        </button>
        {/* <button
          type="button"
          className="btn btn--outline"
          onClick={() => setView('wallet')}
        >
          <div className="btn__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
          </div>
          <span className="btn__label">Connect your web3 wallet</span>
        </button> */}
        <button
          className="btn relative flex-grow normal-case"
          onClick={() => setView('webauthn')}
        >
          <div className="avatar">
            <div className="w-8 rounded">
              <Image
                src="/login-logos/icons8-touch-id.svg"
                alt="Fingerprint logo"
                fill
              ></Image>
            </div>
          </div>
          <div className="avatar">
            <div className="w-8 rounded">
              <Image
                src="/login-logos/Face_ID_logo.svg"
                alt="Face id logo"
                fill
              ></Image>
            </div>
          </div>
          Continue with Webauthn
        </button>
      </div>
    </>
  );
};

export default AuthMethods;
