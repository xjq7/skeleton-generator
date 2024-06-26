import React from 'react';
import S from './index.module.less';
import ArticleList from './article-list'

/**
 * 用户信息 Demo 页
 *
 * @export
 * @return {*}
 */
export default function Component() {
  return (
    <div className={S.container}>
      <ArticleList />
    </div>
  );
}
