import React, { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import Skeleton from '@components/react-skeleton';
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
    }, 2000);
  }, []);

  return (
    <div className={S.container}>
      <Card title="用户列表">
        <div className={S.operator}>
          <Button
            type="primary"
            onClick={() => {
              setLoading(true);
            }}
          >
            预览
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setLoading(false);
            }}
          >
            关闭预览
          </Button>
        </div>

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
      </Card>
    </div>
  );
}
