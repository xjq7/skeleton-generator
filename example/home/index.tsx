import React from 'react';
import { routes } from '../router';
import S from './index.module.less';
import { useNavigate } from 'react-router-dom';

export default function Component() {
  const navigate = useNavigate();

  return (
    <div className={S.container}>
      {routes.map((route) => {
        const { key, path } = route;

        if (path === '/') return null;
        return (
          <div
            className={S.item}
            key={key}
            onClick={() => {
              navigate(path, {});
            }}
          >
            {key}
          </div>
        );
      })}
    </div>
  );
}
