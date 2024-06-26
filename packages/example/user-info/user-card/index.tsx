import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import Skeleton from '@components/react-skeleton';
import skeletonSource from './skeletonSource.json';
import S from './index.module.less';

export default function Component() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className={S.container}>
      <Card title="用户卡片">
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
          <Skeleton data={skeletonSource} loading={loading} style={{ width: 200, height: 80 }}>
            <div className={S['user-info']}>
              <div className={S.name}>xjq</div>
              <div className={S.desc}>斗宗强者</div>
            </div>
            <div className={S['img-wrap']}>
              <img src="https://image.xjq.icu/2024/6/19/1718771694621_portrait-6064965_640.jpg" className={S.img} />
            </div>
          </Skeleton>
        </div>
      </Card>
    </div>
  );
}
