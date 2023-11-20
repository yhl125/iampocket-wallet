'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import Text from '@/components/commons/Text';
import CardButton from '@/components/main/CardButton';
import theme from '@/styles/theme';
import Button from '@/components/commons/Button';
import Icon from '@/components/commons/Icon';
import IconButton from '@/components/commons/IconButton';
import Input from '@/components/commons/Input';
import { useState } from 'react';

function MainPage() {
  const router = useRouter();

  const [inputTestValue, setInputTestValue] = useState('');

  return (
    <Container>
      <Row>
        <Input
          value={inputTestValue}
          onChange={(e) => {
            setInputTestValue(e.target.value);
          }}
          size="medium"
          placeholder="Search"
          error={{
            message: 'not enough balance',
          }}
          suffixComponent={
            <Button
              size="small"
              text="Resend Code"
              type="primary"
              onClick={() => {}}
            />
          }
        />
        <br />
        <br />
        <Input
          value={inputTestValue}
          onChange={(e) => {
            setInputTestValue(e.target.value);
          }}
          size="small"
          placeholder="Search"
          error={{
            message: 'not enough balance',
          }}
        />
      </Row>
    </Container>
  );
}

const Container = styled.div`
  /* background: linear-gradient(-90deg, #10ff84, #5fddff);
  background-size: 200% 200%;

  animation: gradientAnimation 5s ease infinite;

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  } */

  background-color: black;

  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.small};

  padding: 50px;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.xTiny};
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  column-gap: 10px;
`;
const ButtonWrapper = styled.div`
  display: flex;
  column-gap: ${theme.space.small};
  row-gap: ${theme.space.small};
  flex-wrap: wrap;
  flex-direction: column;

  margin-top: ${theme.space.base};
`;
export default MainPage;
