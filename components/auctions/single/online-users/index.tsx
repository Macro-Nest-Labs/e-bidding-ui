import cx from 'classnames';
import React, { FC } from 'react';

import { ISupplierModel } from '@/utils/types/be-model-types';

import OnlineUserCard from './online-user-card';
import styles from './online-users.module.scss';

type TOnlineUsersProps = {
  onlineUsers: ISupplierModel[];
  className?: string;
};

const OnlineUsers: FC<TOnlineUsersProps> = ({ onlineUsers, className }) => {
  // TODO: Add a heading for this card and also check for empty list and display appropriate message
  // TODO: Add nice styling for this component
  return (
    <div className={cx(styles['online-users-container'], className)}>
      {onlineUsers.map((user) => (
        <OnlineUserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default OnlineUsers;
