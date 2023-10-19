'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import Text from '@/components/commons/Text';
import CardButton from '@/components/main/CardButton';
import theme from '@/styles/theme';

function MainPage() {
  const router = useRouter();

  return (
    <Container>
      <Text size="title3" color="backgroundMain" $bold>
        Welcome to iamPocket
      </Text>
      <Description>
        <Text size="body4" color="backgroundMain" $thin>
          Wallet for all
        </Text>
        <Text size="body4" color="backgroundMain" $thin>
          Wallet for you
        </Text>
      </Description>
      <ButtonWrapper>
        <CardButton
          icon="login"
          title="Login"
          description="Already have an account?"
          onClick={() => {
            router.push('/login');
          }}
        />
        <CardButton
          icon="add"
          title="Sign up"
          description="Need an account?"
          onClick={() => {
            router.push('/signup');
          }}
        />
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  background: linear-gradient(-90deg, #10ff84, #5fddff);
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
  }

  border-radius: 5px;
  padding: ${theme.space.medium};
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.small};
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.xTiny};
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
