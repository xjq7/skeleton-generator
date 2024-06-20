import { SkeletonNode } from './type';

/**
 * 创建一个图节点
 * @param {*} x
 * @param {*} y
 * @returns
 */
function createNode(x: number, y: number) {
  return `${x}_${y}`;
}

/**
 * 解构一个图节点，获取 x, y
 * @param {*} node
 * @returns
 */
function deconstructNode(node: string) {
  return node.split('_').map(Number);
}

/**
 * 对骨架屏数据做合并处理
 * 1. 过滤重复的
 * 2. 合并相邻且尺寸一致的
 * @param {*} nodes
 * @returns
 */
export function mergePosition(nodes: SkeletonNode[]) {
  const graph: Record<string, [string, string]> = {};

  const brs: Record<string, string> = {};

  const marked: Record<string, boolean> = {};

  function findEnd(gNodeTail: string, isX: boolean, size: number) {
    if (!graph[gNodeTail]) return gNodeTail;
    let tail = gNodeTail;
    const [x, y] = deconstructNode(gNodeTail);
    const [ln, rn] = graph[gNodeTail];

    if (isX) {
      const [, cy] = deconstructNode(rn);
      const h = cy - y;
      if (Math.abs(h - size) < 2) {
        tail = findEnd(ln, isX, size);
      }
    } else {
      const [cx] = deconstructNode(ln);
      const w = cx - x;
      if (Math.abs(w - size) < 2) {
        tail = findEnd(rn, isX, size);
      }
    }

    if (gNodeTail !== tail) {
      marked[gNodeTail] = true;
    }

    return tail;
  }
  nodes.forEach((node) => {
    const { x, y, w, h, br } = node;

    const x1 = x + w;
    const y1 = y + h;

    const gNode1 = createNode(x, y);
    if (br) {
      brs[gNode1] = br;
    }

    if (graph[gNode1]) {
      const [x1, y1] = graph[gNode1];

      const [xx] = deconstructNode(x1);
      const [, yy] = deconstructNode(y1);
      const gNode2 = createNode(Math.max(xx, x), y);
      const gNode3 = createNode(x, Math.max(y, yy));
      graph[gNode1] = [gNode2, gNode3];
    } else {
      const gNode2 = createNode(x1, y);
      const gNode3 = createNode(x, y1);

      graph[gNode1] = [gNode2, gNode3];
    }
  });

  const nNodes = [];

  for (const gNode in graph) {
    if (!marked[gNode]) {
      const [x, y] = deconstructNode(gNode);

      const [gNode1, gNode2] = graph[gNode];
      const [x1] = deconstructNode(gNode1);
      const [, y2] = deconstructNode(gNode2);
      const h = y2 - y;
      const w = x1 - x;

      const tailX = findEnd(gNode1, true, h);
      const tailY = findEnd(gNode2, false, w);

      const [tx] = deconstructNode(tailX);
      const [, ty] = deconstructNode(tailY);

      nNodes.push({
        x,
        y,
        w: tx - x,
        h: ty - y,
        br: brs[gNode],
        wg: 1,
      });

      marked[gNode] = true;
    }
  }

  return nNodes;
}

/**
 * 合并边界框重叠度 > 0.8 的元素
 * @param {*} nodes 节点信息
 * @returns
 */
export function mergeHighOverlapNodes(nodes: SkeletonNode[]) {
  // 标记节点是否合并过
  const mergedFlags: boolean[] = Array.from({ length: nodes.length }, () => false);
  // 合并后的节点
  const mergedNodes: SkeletonNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    if (mergedFlags[i]) continue;

    let n1 = nodes[i];
    const { x: x1, y: y1, w: w1, h: h1, br: br1, wg: wg1 } = n1;
    let merged = false;

    for (let j = i + 1; j < nodes.length; j++) {
      if (mergedFlags[j]) continue;

      const n2 = nodes[j];
      const { x: x2, y: y2, w: w2, h: h2, br: br2, wg: wg2 } = n2;

      // 计算重叠度
      const xOverlap = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2));
      const yOverlap = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2));
      const overlap = (xOverlap * yOverlap) / (w1 * h1 + w2 * h2 - xOverlap * yOverlap);

      if (overlap > 0.8) {
        // 合并节点
        n1 = {
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          w: Math.max(x1 + w1, x2 + w2) - Math.min(x1, x2),
          h: Math.max(y1 + h1, y2 + h2) - Math.min(y1, y2),
          br: br1 || br2,
          wg: Math.max(wg1 || 1, wg2 || 1),
        };

        // 标记节点已被合并过
        mergedFlags[j] = true;
        merged = true;
      }
    }

    // 添加合并后的节点
    mergedNodes.push(n1);
    mergedFlags[i] = merged;
  }

  return mergedNodes;
}

/**
 * 节点加权
 *
 * @param {SkeletonNode[]} nodes
 * @return {*}
 */
export function weightNode(nodes: SkeletonNode[]) {
  nodes.forEach((node1) => {
    const { x, y, w, h } = node1;

    nodes.forEach((node2) => {
      const { x: x1, y: y1, w: w1, h: h1 } = node2;

      if (x1 < x && y1 < y && w1 + x1 > w + x && h1 + y1 > h + y) {
        node2.wg = (node1.wg || 1) + 1;
      }
    });
  });

  return nodes;
}
