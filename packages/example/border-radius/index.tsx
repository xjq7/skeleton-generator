import React, { useEffect, useState } from 'react';
import skeletonSource from './skeletonSource.json';
import S from './index.module.less';
import Skeleton from '../component/react-skeleton';

export default function Component() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <div className={S.container}>
      <Skeleton data={skeletonSource} loading={loading}>
        <div className={S.content}>
          <div className={S['user-info']}>
            <div className={S.name}>xjq</div>
            <div className={S.desc}>斗宗强者</div>
          </div>
          <div className={S['img-wrap']}>
            <img src="https://image.xjq.icu/2024/6/19/1718771694621_portrait-6064965_640.jpg" className={S.img} />
          </div>
        </div>
      </Skeleton>
    </div>
  );
}
