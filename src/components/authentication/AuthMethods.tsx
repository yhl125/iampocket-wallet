import styled from 'styled-components';
import { AuthView } from '../login/SignUpMethods';
import IconButton from '../commons/IconButton';
import Button from '../commons/Button';
import Icon from '../commons/Icon';
import theme from '@/styles/theme';
import Text from '../commons/Text';

interface AuthMethodsProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  setView: React.Dispatch<React.SetStateAction<AuthView>>;
}

export default function AuthMethods({
  handleGoogleLogin,
  handleDiscordLogin,
  setView,
}: AuthMethodsProps) {
  return (
    <Container>
      <Top>
        <SocialLoginWrapper>
          <IconButton
            text="Google"
            icon="google"
            size="large"
            type="primary"
            onClick={handleGoogleLogin}
          />
          <IconButton
            text="Discord"
            icon="discord"
            size="large"
            type="primary"
            onClick={handleDiscordLogin}
          />
        </SocialLoginWrapper>
        <IconButton
          text="Webauthn"
          icon="fingerprint"
          size="large"
          type="primary"
          onClick={() => setView('webauthn')}
        >
          <Icon type="faceid" height={24} />
        </IconButton>
      </Top>
      <DividerWrapper>
        <Divider />
        <Text color="bg40" $thin size="body3">
          or continue with
        </Text>
        <Divider />
      </DividerWrapper>
      <Bottom>
        <OtherLoginWrapper>
          <IconButton
            text="SMS"
            icon="mobile"
            size="small"
            type="secondary"
            disabled
            onClick={() => setView('phone')}
          />
          <IconButton
            text="E-mail"
            icon="mail"
            size="small"
            type="secondary"
            disabled
            onClick={() => setView('email')}
          />
        </OtherLoginWrapper>
      </Bottom>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  row-gap: ${theme.space.tiny};
  flex-direction: column;
`;

const SocialLoginWrapper = styled.div`
  display: flex;
  column-gap: ${theme.space.tiny};
`;

const DividerWrapper = styled.div`
  margin-top: ${theme.space.tiny};
  margin-bottom: ${theme.space.xTiny};

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Divider = styled.div`
  background-color: ${theme.color.bg40};
  height: 1px;
  width: calc((100% - 140px) / 2);
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${theme.space.tiny};
`;
const Bottom = styled.div``;

const OtherLoginWrapper = styled(SocialLoginWrapper)``;
