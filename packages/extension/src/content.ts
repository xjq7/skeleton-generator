import { preview, generate } from '@sg/gen';
import { copy } from './utils';
import { getConfig, getSelector } from './config';

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  const { action, data } = request;

  const el = await getSelector();
  const { previewTime } = await getConfig();

  // 预览处理
  if (action === 'preview') {
    preview(el, previewTime);
  } else if (action === 'copy') {
    const nodes = await generate(el);
    // 将节点数据 copy 到剪贴板
    copy(JSON.stringify(nodes));
  } else if (action === 'setConfig') {
    console.log(data);
    localStorage.setItem('config', JSON.stringify(data));
  }
});
