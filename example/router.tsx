import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import BorderRadius from './border-radius';
import Home from './home';
import Overlap from './overlap';
import Weight from './weight';

export const routes = [
  {
    path: '/',
    key: '首页',
    element: <Home></Home>,
  },
  {
    path: '/border-radius',
    key: '圆角',
    element: <BorderRadius></BorderRadius>,
  },
  {
    path: '/overlap',
    key: '边框重叠',
    element: <Overlap></Overlap>,
  },
  {
    path: '/weight',
    key: '上下重叠加权',
    element: <Weight></Weight>,
  },
];

const router = createBrowserRouter(routes);

export default router;
