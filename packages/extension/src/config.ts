interface Config {
  selector: string;
  previewTime: number;
}

/**
 * 获取配置信息
 *
 * @return {*}
 */
export async function getConfig() {
  const storage = await chrome.storage.local.get();
  const {
    config = {
      selector: '.lowcode-container',
      previewTime: 5,
    },
  } = storage;
  return config as Config;
}

/**
 * 获取容器节点
 *
 * @return {*}
 */
export async function getSelector() {
  const config = await getConfig();
  const { selector } = config;
  const containers = document.querySelectorAll(selector);
  return containers[0];
}
