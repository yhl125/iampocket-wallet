'use client';

import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import Input from '@/components/commons/Input';
import Text from '@/components/commons/Text';
import CardButton from '@/components/main/CardButton';
import theme from '@/styles/theme';
import Button from '@/components/commons/Button';

function MainPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'error test') {
      setErrorMessage('invalid value');
    } else {
      setErrorMessage('');
    }
    setInput(e.target.value);
  };
  return (
    <ComponentTestContainer>
      <Row>
        <Input
          value={input}
          onChange={handleInput}
          type="text"
          placeholder="Input Something"
          error={{
            message: errorMessage,
          }}
        />
        <Button
          text="Button"
          type="secondary"
          size="medium"
          onClick={() => {}}
        />
        <Button
          text="Button"
          type="secondary"
          size="medium"
          disabled
          onClick={() => {}}
        />
      </Row>
    </ComponentTestContainer>
  );
}

const Row = styled.div`
  display: flex;
  /* flex-direction: column; */
  row-gap: 8px;
  column-gap: 8px;
`;

const ComponentTestContainer = styled.div`
  background-color: ${theme.color.bg400};

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  padding: 20px;
`;

export default MainPage;
