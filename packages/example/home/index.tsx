import React from 'react';
import { Card, List } from 'antd';
import { Link } from 'react-router-dom';

import { routes } from '../router';
import S from './index.module.less';

export default function Component() {
  return (
    <div className={S.container}>
      <div className={S.title}>骨架屏效果展示 demo</div>

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={routes.filter((o) => o.path !== '/')}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.key} style={{ width: 180, margin: 20 }}>
              <Link to={item.path} target="_blank">
                点击前往
              </Link>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
