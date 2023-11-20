import React, { useCallback, useState } from 'react';
import { ChatAutoComplete, useChatContext, Notify } from '@web3mq/react-components';
import cx from 'classnames';

import { OpenModalIcon, WarningIcon } from '../icons';

import ss from './index.module.css';

const MsgInput: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { appType } = useChatContext('MsgInput');


  const RenderOperation = useCallback(() => {
    return (
      <div className={ss.operationContainer}>
        <div className={ss.operation}>
          <Notify />
        </div>
        <div className={ss.warning}>
          <WarningIcon className={ss.icon} />
          General smart contract support is coming soon
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <div className={cx(ss.inputBox, { [ss.mobileStyle]: appType === 'h5' })}>
        <OpenModalIcon
          className={cx(ss.auditBox, {
            [ss.close]: visible,
          })}
          onClick={() => setVisible(!visible)}
        />
        <ChatAutoComplete />
      </div>
      {visible && <RenderOperation />}
    </>
  );
};

export default MsgInput;
