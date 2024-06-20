chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: '预览',
    id: 'preview',
    contexts: ['all'],
  });
  chrome.contextMenus.create({
    title: '复制数据',
    id: 'copy',
    contexts: ['all'],
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  const { menuItemId } = info;
  const { id } = tab || {};
  if (!id) return;

  switch (menuItemId) {
    case 'preview':
      chrome.tabs.sendMessage(id, { action: menuItemId });
      break;
    case 'copy':
      chrome.tabs.sendMessage(id, { action: menuItemId });
      break;
    default:
  }
});
