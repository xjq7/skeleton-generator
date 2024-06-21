import React, { ReactNode } from 'react';
import S from './index.module.less';

interface SkeletonProps {
  style?: React.CSSProperties;
  data: { container: { x?: number; y?: number; w?: number; h?: number }; children: IPos[] };
  loading?: boolean;
  children?: ReactNode;
  className?: string;
}

interface IPos {
  w?: string | number;
  h?: string | number;
  x: string | number;
  y: string | number;
  br?: string;
  wg?: number;
}

/**
 * 渲染每个骨块
 *
 * @param {IPos} props
 * @return {*}
 */
function Pos(props: IPos) {
  const { w, h, x, y, br, wg = 1 } = props;
  return (
    <div
      className={S.pos}
      style={{
        width: w,
        height: h,
        left: x,
        top: y,
        borderRadius: br,
        opacity: 1 - (wg - 1) * 0.2,
      }}
    />
  );
}

/**
 * 骨架屏组件
 *
 * @param {SkeletonProps} props
 * @return {*}
 */
function Skeleton(props: SkeletonProps) {
  const { loading, data, style, className, children } = props;

  if (!loading) return children;

  const { children: poss, container } = data;
  const { w, h } = container;

  return (
    <div className={className} style={{ position: 'relative', width: w, height: h, ...style }}>
      {poss.map((pos) => (
        <Pos {...pos} />
      ))}
    </div>
  );
}

export default Skeleton;
