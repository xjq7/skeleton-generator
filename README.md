# 骨架屏生成插件

## 示例

一个 带有骨架屏效果的 example 页

https://sg.xjq.icu

## 开发

- 依赖安装

  根目录下安装依赖

  ```sh
  pnpm i
  ```

### chrome 插件开发

- 先构建 gen 包

  ```sh
  pnpm --filter gen run dev
  ```

- 本地开发

  ```sh
  pnpm --filter extension run dev
  ```

  代码变更重新构建之后需要在 插件页(chrome://extensions/) 刷新下指定插件

  然后刷新使用页面

- 打包构建

  ```sh
  pnpm --filter extension run build
  ```

### 核心生成包 gen

- 开发

  ```sh
  pnpm --filter gen run dev
  ```

- 打包

  ```sh
  pnpm --filter gen run build
  ```

### example demo

- 开发

  ```sh
  pnpm --filter example run dev
  ```

- 打包

  ```sh
  pnpm --filter example run build
  ```
