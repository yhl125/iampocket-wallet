import React from 'react';
import cx from 'classnames';
import { 
  Channel,
  MessageConsole,
  MessageHeader,
  MessageList,
  MessageInput,
  Window,
  useChatContext
} from '@web3mq/react-components';
import MsgInput from '../MsgInput';
import Notification from '../Notification';

import './index.css';

const Main = () => {
  const { activeNotification } = useChatContext('Main');

  return (
    <>
      <Channel className={cx({
        'hide': activeNotification
      })}>
        <Window>
          <MessageHeader avatarSize={40} />
          <MessageList />
          <MessageConsole Input={<MessageInput Input={MsgInput} />} />
        </Window>
      </Channel>
      <Notification />
    </>
  )
};
export default Main;