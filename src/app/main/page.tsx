'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import Text from '@/components/commons/Text';
import CardButton from '@/components/main/CardButton';
import theme from '@/styles/theme';
import Button from '@/components/commons/Button';
import CheckBox from '@/components/commons/CheckBox';
import Icon from '@/components/commons/Icon';
import Input from '@/components/commons/Input';
import { useState } from 'react';
import DropDown from '@/components/commons/DropDown';
import TokenList from '@/components/wallet/tokenList';
import { useSnapshot } from 'valtio';
import TokenStore from '@/store/TokenStore';

function MainPage() {
  const router = useRouter();

  const [inputTestValue, setInputTestValue] = useState('');

  const tokenList: any[] = [
    {
      name: 'janf',
      symbol: 'Token',
      logoUrl: '',
    },
    {
      name: 'janwe',
      symbol: 'Token',
      logoUrl: '/images/none.png',
    },
    {
      name: 'qweqwe',
      symbol: 'Token',
      logoUrl:
        'https://bin.bnbstatic.com/image/admin_mgs_image_upload/20201110/3a8c9fe6-2a76-4ace-aa07-415d994de6f0.png',
    },
    {
      name: 'gkfke',
      symbol: 'Token',
      logoUrl:
        'https://bin.bnbstatic.com/image/admin_mgs_image_upload/20201110/87496d50-2408-43e1-ad4c-78b47b448a6a.png',
    },
    {
      name: 'gkfke',
      symbol: 'Token',
      logoUrl:
        'https://bin.bnbstatic.com/image/admin_mgs_image_upload/20201110/87496d50-2408-43e1-ad4c-78b47b448a6a.png',
    },
  ];

  const [dropDownTestValue, setDropDownTestValue] = useState(() =>
    tokenList.length === 0
      ? {
          name: 'You dont have any Token',
          logoUrl:
            'https://bin.bnbstatic.com/image/admin_mgs_image_upload/20201110/87496d50-2408-43e1-ad4c-78b47b448a6a.png',
        }
      : tokenList[0],
  );

  console.log(dropDownTestValue);
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
        ></Input>
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
        ></Input>
        <DropDown
          contents={tokenList}
          selectContentState={dropDownTestValue}
          setSelectContentState={setDropDownTestValue}
          iconKey="logoUrl"
          nameKey="name"
          size="medium"
        ></DropDown>
        <Text>{dropDownTestValue.name}</Text>
        {/* <CheckBox></CheckBox> */}
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
