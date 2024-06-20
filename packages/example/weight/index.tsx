import React, { useEffect, useState } from 'react';
import Skeleton from '../component/react-skeleton';
import skeletonSource from './skeletonSource.json';
import S from './index.module.less';

const data = [
  {
    name: 'xjq',
    favorite: 'play',
    avatar: 'https://image.xjq.icu/2024/6/19/1718771694621_portrait-6064965_640.jpg',
  },
  {
    name: 'hls',
    favorite: 'eat',
    avatar: 'https://image.xjq.icu/2024/6/19/1718771694621_portrait-6064965_640.jpg',
  },
  {
    name: 'hls2',
    favorite: 'eat',
    avatar: 'https://image.xjq.icu/2024/6/19/1718771694621_portrait-6064965_640.jpg',
  },
  {
    name: 'xjq1',
    favorite: 'play',
    avatar: 'https://image.xjq.icu/2024/6/19/1718771694621_portrait-6064965_640.jpg',
  },

  {
    name: 'xjq2',
    favorite: 'play',
    avatar: 'https://image.xjq.icu/2024/6/19/1718771694621_portrait-6064965_640.jpg',
  },
];

/**
 * 加权盒子示例
 * @returns
 */
export default function Component() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <div className={S.container}>
      <div className={S.content}>
        <Skeleton data={skeletonSource} loading={loading}>
          {data.map((o, index) => {
            const { name, favorite, avatar } = o;
            return (
              <div className={S.item} key={index}>
                <div className={S.name}>{name}</div>
                <div className={S.favorite}>{favorite}</div>
                <img className={S.avatar} src={avatar} />
              </div>
            );
          })}
        </Skeleton>
      </div>
    </div>
  );
}
