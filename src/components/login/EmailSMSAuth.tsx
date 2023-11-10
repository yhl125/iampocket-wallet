import { useState } from 'react';
import styled from 'styled-components';
import { sendOTPCode } from '@/utils/lit';
import { AuthView } from './SignUpMethods';
import theme from '@/styles/theme';
import Text from '../commons/Text';
import Input from '../commons/Input';
import Button from '../commons/Button';

type OtpMethod = 'email' | 'phone';

interface EmailSMSAuthProps {
  method: OtpMethod;
  setView: React.Dispatch<React.SetStateAction<AuthView>>;
  authWithOTP: any;
}

const EmailSMSAuth = ({ method, setView, authWithOTP }: EmailSMSAuthProps) => {
  const [userId, setUserId] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [isSended, setIsSended] = useState<boolean>(false);
  const [sendError, setSendError] = useState<Error>();

  async function handleSendCode(event: any) {
    event.preventDefault();
    setSendLoading(true);
    setSendError(undefined);
    try {
      await sendOTPCode(userId);
      setIsSended(true);
    } catch (err: any) {
      setSendError(err);
    } finally {
      setSendLoading(false);
    }
  }

  async function handleAuth(event: any) {
    event.preventDefault();
    setSendLoading(false);
    setSendError(undefined);
    await authWithOTP(code);
  }

  return (
    <>
      {sendError && (
        <div className="alert alert-error">
          <p>{sendError.message}</p>
        </div>
      )}

      <Text size="title1" $bold>
        Sign Up with {method}
      </Text>
      <EmailSmsAuthWrapper>
        <FormWrapper>
          <Text size="body2" color="bg20" $thin>
            Enter your {method}
            <br />A verification code will be sent to your {method}.
          </Text>

          <form className="form" onSubmit={handleSendCode}>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              size="medium"
              type={method === 'email' ? 'email' : 'tel'}
              placeholder={
                method === 'email' ? 'Your email' : 'Your phone number'
              }
              style={{ display: 'flex', justifyContent: 'space-between' }}
              suffixComponent={
                <Button
                  size="small"
                  text={isSended ? 'Resend Code' : 'Send code'}
                  type="primary"
                  onClick={handleSendCode}
                  disabled={sendLoading}
                />
              }
            />
          </form>
        </FormWrapper>
        {/* {isSended && ( */}
        <FormWrapper>
          <Text size="body2" color="bg20" $thin>
            Verify your {method}
          </Text>
          <form id="codeForm" onSubmit={handleAuth}>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              size="medium"
              type="code"
              placeholder="Verification code"
              style={{
                display: 'flex',
                marginBottom: `${theme.space.medium}`,
              }}
            />
            <Button
              text="Verify"
              size="large"
              type="primary"
              onClick={handleAuth}
            />
          </form>
        </FormWrapper>
        {/* )} */}
      </EmailSmsAuthWrapper>
      <button onClick={() => setView('default')} className="btn	 btn-link">
        Back
      </button>
    </>
  );
};

const EmailSmsAuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${theme.space.sMedium};
  row-gap: ${theme.space.medium};
  margin-bottom: ${theme.space.large};
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.tiny};
`;

export default EmailSMSAuth;
