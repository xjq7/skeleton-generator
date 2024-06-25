import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './home';
import UserInfo from './user-info';
import List from './juejin'

export const routes = [
  {
    path: '/',
    key: '首页',
    element: <Home />,
  },
  {
    path: 'user-info',
    key: '用户信息',
    element: <UserInfo />,
  },
  {
    path: 'list',
    key: '列表',
    element: <List />
  }
];

const router = createBrowserRouter(routes);

export default router;
