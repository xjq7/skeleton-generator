import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './home';
import UserInfo from './user-info';

export const routes = [
  {
    path: '/',
    key: '首页',
    element: <Home></Home>,
  },
  {
    path: 'user-info',
    key: '用户信息',
    element: <UserInfo />,
  },
];

const router = createBrowserRouter(routes);

export default router;
