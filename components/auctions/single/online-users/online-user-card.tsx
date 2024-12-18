import cx from 'classnames';
import React, { FC } from 'react';

import { ISupplierModel } from '@/utils/types/be-model-types';

import styles from './online-users.module.scss';

type TOnlineUserCardProps = {
  user: ISupplierModel;
};

const OnlineUserCard: FC<TOnlineUserCardProps> = ({ user }) => {
  return (
    <div className={cx(styles['online-user-card'])}>
      <div>User: {`${user.firstName} ${user.lastName}`}</div>
      <div>Email: {user.email}</div>
    </div>
  );
};

export default OnlineUserCard;
