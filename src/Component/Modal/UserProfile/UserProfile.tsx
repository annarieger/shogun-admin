import React, {
  useState,
  ReactElement
} from 'react';

import {
  Modal
} from 'antd';

import { ModalProps } from 'antd/lib/modal';

import UserProfileForm from './UserProfileForm/UserProfileForm';

import './UserProfile.less';

interface UserProfileProps extends ModalProps {
  opener?: ReactElement;
  appInfo: any;
}

export const UserProfile: React.FC<UserProfileProps> = props => {

  const [isVisible, setVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    setVisible(!isVisible);
  };

  const {
    opener,
    appInfo: {
      user
    },
    ...restProps
  } = props;

  let Opener;
  if (opener) {
    Opener = React.cloneElement(
      opener,
      {
        onClick: toggleVisibility
      }
    );
  } else {
    Opener = <button onClick={toggleVisibility}>Open</button>;
  }

  return (
    <>
      {
        Opener
      }
      <Modal
        className="profile-settings"
        centered={true}
        title="Profile settings"
        visible={isVisible}
        onOk={toggleVisibility}
        onCancel={toggleVisibility}
        footer={null}
        {...restProps}
      >
        <UserProfileForm
          user={user}
        />
      </Modal>
    </>
  );
};

export default UserProfile;