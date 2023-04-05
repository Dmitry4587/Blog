import React from 'react';
import { Avatar } from '@mui/material';
import styles from './UserInfo.module.scss';

interface IUserInfoProps {
  avatarUrl: string;
  fullName: string;
  additionalText: string;
}

const UserInfo = ({ avatarUrl, fullName, additionalText }: IUserInfoProps) => (
  <div className={styles.root}>
    <Avatar className={styles.avatar} src={avatarUrl} alt={fullName} />
    <div className={styles.userDetails}>
      <span className={styles.userName}>{fullName}</span>
      <span className={styles.additional}>{additionalText}</span>
    </div>
  </div>
);

export default UserInfo;
