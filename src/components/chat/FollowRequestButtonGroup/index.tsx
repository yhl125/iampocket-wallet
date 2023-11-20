import React, { useState } from 'react';
import { Client, GetFollowSignContentParams } from '@web3mq/client';

import { AddFriends } from '../AddFriends';
import useToggle from '@/hooks/chat/useToggle';
import { Button, Modal, useChatContext } from '@web3mq/react-components';
import { ExclamationCircleIcon } from '../icons';

import ss from './index.module.css';
import { signMessage } from '@/utils/SignMessage';
import { useSnapshot } from 'valtio';
import AddressStore from '@/store/AddressStore';
import PKPStore from '@/store/PKPStore';

type FollowRequestButtonGroupProps = {
  client: Client;
  containerId?: string;
  followDisabled?: boolean;
  warnText?: string;
  showFollow?: boolean;
  showBlockBtn?: boolean;
  userId?: string;
  onFollow?: () => void;
  onCancel?: () => void;
};
const timeIdObject: Record<string, NodeJS.Timeout> = {};

export const FollowRequestButtonGroup: React.FC<
  FollowRequestButtonGroupProps
> = (props) => {
  const {
    client,
    containerId = '',
    followDisabled,
    warnText,
    showFollow = false,
    showBlockBtn = false,
    userId = '',
    onCancel,
    onFollow,
  } = props;
  const { loginUserInfo } = useChatContext();
  const { visible, show, hide } = useToggle(false);
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [isRequest, setIsRequest] = useState<boolean>(false);
  const { currentPKP, sessionSigs } = useSnapshot(PKPStore.state);
  // const { selectedWallet } = useSnapshot(AddressStore.state);
  // Web3MQ is not working with smart contract wallet
  const selectedWallet = 'pkpViem';

  const followOperation = async (params: GetFollowSignContentParams) => {
    const { signContent, timestamp } =
      await client.contact.getFollowOperationSignContent(params);
    const myAddress = localStorage.getItem('Web3MQ-WalletAddress');
    if (myAddress) {
      const signature = await signMessage(
        signContent,
        currentPKP!.publicKey,
        sessionSigs!,
        selectedWallet,
      );
      const params2 = {
        didPubkey: myAddress,
        signature,
        signContent,
        followTimestamp: timestamp,
        ...params,
      };
      const res = await client.contact.followOperationBySignature(params2);
      return res;
    }
  };

  const handleFollow = async (callback?: () => void) => {
    try {
      if (loginUserInfo) {
        await followOperation({
          targetId: userId,
          action: 'follow',
          targetDidType: 'eth',
        });
        setIsFollow(true);
        callback && callback();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowOrRequest = async (type: boolean) => {
    if (type) {
      try {
        await handleFollow(onFollow);
      } catch (error) {
        console.log(error);
      }
    } else {
      show();
    }
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const addFriendCallback = () => {
    if (userId) {
      timeIdObject[userId] && clearTimeout(timeIdObject[userId]);
      hide();
      setIsRequest(true);
      timeIdObject[userId] = setTimeout(() => {
        setIsRequest(false);
      }, 60000);
    }
  };

  return (
    <div className={ss.operateFollowRequestBar}>
      {warnText && (
        <div className={ss.warning}>
          <ExclamationCircleIcon className={ss.warnIcon} />
          {warnText}
        </div>
      )}
      {userId && (
        <>
          {showBlockBtn && !showFollow && (
            <Button
              block
              disabled={isFollow}
              size="large"
              style={{ marginBottom: '16px' }}
              type="primary"
              onClick={() => handleFollow()}
            >
              {!isFollow ? 'Follow' : 'Following'}
            </Button>
          )}
          <Button className={ss.cancelBtn} size="large" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className={ss.operateBtn}
            disabled={showFollow ? followDisabled || isFollow : isRequest}
            size="large"
            type={showBlockBtn ? 'ghost' : 'primary'}
            onClick={() => handleFollowOrRequest(showFollow)}
          >
            {showFollow
              ? !isFollow
                ? 'Follow'
                : 'Following'
              : !isRequest
              ? 'Request'
              : 'Requesting'}
          </Button>
        </>
      )}
      <Modal
        containerId={containerId}
        dialogClassName={ss.dialogContent}
        title="Request"
        visible={visible}
        closeModal={hide}
      >
        <AddFriends
          client={client}
          disabled={true}
          userId={userId}
          onSubmit={addFriendCallback}
        />
      </Modal>
    </div>
  );
};
