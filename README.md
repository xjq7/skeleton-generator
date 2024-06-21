# 骨架屏生成插件

## 示例

一个 带有骨架屏效果的 example 页

https://sg.xjq.icu

## 使用

### chrome 插件

下载 [skeleton-generator.rar](https://image.xjq.icu/2024/6/21/1718956891159_skeleton-generator.rar) 并解压

chrome 浏览器中进入 chrome://extensions/

点击 加载已解压的扩展程序, 选中 解压的 skeleton-generator 目录

![](https://image.xjq.icu/2024/6/21/1718955403028_image.png)

成功加载之后

![](https://image.xjq.icu/2024/6/21/1718955451657_image-1.png)

以 [demo 页面](https://sg.xjq.icu)为例子

找到需要生成的组件容器

![](https://image.xjq.icu/2024/6/21/1718956638607_image-3.png)

输入到 插件 popup 面板里

![](https://image.xjq.icu/2024/6/21/1718956713322_image-4.png)

这里使用的是 class, 所以最终选择器输入框填 .ED4JZ8zZvzWhoef_o6xc

在页面中右键点击 skeleton-generator 插件 选项中的预览 查看效果

![](https://image.xjq.icu/2024/6/21/1718956833607_image-5.png)

点击复制获取骨架数据

### debug 控制台(待开发)

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
