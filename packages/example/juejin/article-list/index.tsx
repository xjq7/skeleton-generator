import React, { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import Skeleton from '@components/react-skeleton';
import S from './index.module.less';
import cx from 'classnames';
import EyeIcon from './eye.svg';
import LikeIcon from './like.svg';
import skeletonSource from './skeletonSource.json';

interface ArticleItemProps {
  id: number;
  title: string;
  abstract: string;
  author: string;
  likes: number;
  visitors: string;
  thumb?: string;
  tags: string[];
}

const data: ArticleItemProps[] = [
  {
    id: 4,
    title: 'React 18 全新特性解析，Concurrent Mode 大揭密！',
    abstract: 'React 18 带来了很多新的特性，其中最引人注目的就是 Concurrent Mode。本文将详细解析 Concurrent Mode 的工作原理和实际应用场景。',
    author: 'React 爱好者',
    likes: 250,
    visitors: '32K',
    thumb: 'http://gips1.baidu.com/it/u=1025173963,4205445645&fm=3028&app=3028&f=JPEG&fmt=auto?w=3200&h=3200',
    tags: ['前端', 'JavaScript', 'React']
  },
  {
    id: 5,
    title: '前端性能优化终极指南，从入门到精通',
    abstract: '本文将从基础知识开始，逐步介绍前端性能优化的各个方面，包括代码分割、懒加载、缓存策略、图片优化等，为你提供全面的优化策略。',
    author: '性能优化专家',
    likes: 480,
    visitors: '45K',
    thumb: 'http://gips2.baidu.com/it/u=2687682002,935161719&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024',
    tags: ['前端', '性能优化', '实践']
  },
  {
    id: 6,
    title: '深入了解 TypeScript 类型系统，提升代码质量',
    abstract: 'TypeScript 的类型系统是其最强大的功能之一。本文将带你深入了解 TypeScript 的各种类型特性，包括泛型、交叉类型、联合类型等，帮助你编写更安全、更可靠的代码。',
    author: 'TypeScript 大师',
    likes: 300,
    visitors: '29K',
    tags: ['前端', 'TypeScript', '编程']
  }
];


const ArticleItem: React.FC<ArticleItemProps> = ({ title, abstract, author, likes, visitors, tags, thumb }) => (
  <div className={S.item}>
    <div className={S.content} style={{ maxWidth: thumb ? 'calc(100% - 150px)' : '100%' }}>
      <div className={S.title}>{title}</div>
      <div className={S.abstract}>{abstract}</div>

      <div className={S.footer}>
        <div className={S.action}>
          <div className={cx(S.action_item, S.meta)}>{author}</div>
          <div className={S.divider}></div>

          <div className={S.action_item}>
            <EyeIcon />
            <span className={S.action_item_text}>{visitors}</span>
          </div>
          <div className={S.action_item}>
            <LikeIcon />
            <span className={S.action_item_text}>{likes}</span>
          </div>
        </div>

        {tags && (
          <div className={S.tags}>
            {tags.map((tag, index) => (
              <span className={S.tag} key={index}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
    {thumb && (
      <div className={S.thumb}>
        <img className={S.image} src={thumb} alt="" />
      </div>
    )}
  </div>
);

const Component: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={S.container}>
      <Card title="文章列表" bordered={true}>
        <div className={S.operator}>
          <Button type="primary" onClick={() => setLoading(true)}>预览</Button>
          <Button type="primary" onClick={() => setLoading(false)}>关闭预览</Button>
        </div>

        <div className={S.list}>
          <Skeleton data={skeletonSource} loading={loading}>
            {data.map(item => <ArticleItem key={item.id} {...item} />)}
          </Skeleton>
        </div>
      </Card>
    </div>
  );
};

export default Component;
