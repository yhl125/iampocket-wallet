import { IRelayPKP } from '@lit-protocol/types';
import { useState } from 'react';
import styled from 'styled-components';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Button from '../commons/Button';
import Text from '../commons/Text';
import theme from '@/styles/theme';

interface AccountSelectionProp {
  accounts: IRelayPKP[];
  setCurrentAccount: any;
  error?: Error;
}

export default function AccountSelection({
  accounts,
  setCurrentAccount,
  error,
}: AccountSelectionProp) {
  const [selectedValue, setSelectedValue] = useState<string>('0');

  async function handleSubmit(event: any) {
    event.preventDefault();
    const account = accounts[parseInt(selectedValue)];
    return setCurrentAccount(account);
  }

  return (
    <Container>
      {error && (
        <div className="alert alert-error">
          <p>{error.message}</p>
        </div>
      )}

      <Text size="title1" $bold>
        Choose your account
      </Text>
      <FormWrapper>
        <Text size="body2" color="bg20" $thin>
          Continue with one of your accounts.
        </Text>
        <form onSubmit={handleSubmit} className="form">
          <RadioGroup
            className="accounts-wrapper"
            defaultValue="0"
            onValueChange={setSelectedValue}
            aria-label="View accounts"
          >
            {accounts.map((account, index) => (
              <div
                key={`account-${index}`}
                className={`account-item ${
                  selectedValue === index.toString() && 'account-item--selected'
                }`}
              >
                <RadioGroupItem
                  className="account-item__radio"
                  value={index.toString()}
                  id={account.ethAddress}
                >
                  {' '}
                </RadioGroupItem>
                <label
                  className="account-item__label"
                  htmlFor={account.ethAddress}
                >
                  <Text size="body2" color="bg50" $thin>
                    {' '}
                    {account.ethAddress.toLowerCase()}
                  </Text>
                </label>
                \
              </div>
            ))}
          </RadioGroup>
          <ButtonWrapper>
            <Button
              text="Submit"
              size="large"
              type="primary"
              onClick={handleSubmit}
            />
          </ButtonWrapper>
        </form>
      </FormWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  padding-left: ${theme.space.medium};
  padding-right: ${theme.space.medium};
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.sMedium};
  margin-top: ${theme.space.sMedium};
`;

const ButtonWrapper = styled.div`
  margin-top: ${theme.space.medium};
`;
