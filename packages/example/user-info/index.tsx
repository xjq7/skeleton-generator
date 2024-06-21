import React from 'react';
import UserCard from './user-card';
import S from './index.module.less';
import UserList from './user-list';

export default function Component() {
  return (
    <div className={S.container}>
      <UserCard />
      <UserList />
    </div>
  );
}
