import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './home';
import UserInfo from './user-info';
import Juejin from './juejin';

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
    path: 'juejin',
    key: '掘金社区',
    element: <Juejin />,
  },
];

const router = createBrowserRouter(routes);

export default router;
