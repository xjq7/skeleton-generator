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

## 使用

配置面板可修改 骨架屏节点和骨架屏预览时长

通过 预览可查看当前骨架屏效果

效果 ok 的话 通过复制数据获取 骨架屏节点数据, 然后结合 common 包的 Skeleton 组件 绘制完整的骨架屏

## 调试页面

用来启动一些测试页面, 来调试骨架屏组件生成效果

- 启动

```sh
pnpm dev-example
```
