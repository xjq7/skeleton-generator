export interface SkeletonNode {
  x: number;
  y: number;
  w: number;
  h: number;
  wg?: number; // 权值
  br?: string; // 圆角
}

export interface SkeletonSource {
  container: { w?: number; h?: number; x?: number; y?: number };
  children: SkeletonNode[];
}
