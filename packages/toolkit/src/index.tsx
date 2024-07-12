import React, { useState } from 'react';
import { FloatButton } from 'antd';
import { SettingOutlined, CopyOutlined, AppstoreOutlined, EyeOutlined } from '@ant-design/icons';
import { preview, generate } from '@skgen/gen';
import Setting from './setting';
import * as storage from './storage';
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';

const px2rem = px2remTransformer({
  rootValue: 8,
});

function toRem(Component: () => React.JSX.Element) {
  return () => {
    // return (
    //   <StyleProvider transformers={[px2rem]}>
    //     <Component />
    //   </StyleProvider>
    // );

    return <Component />;
  };
}

/**
 * 文本复制方法
 *
 * @export
 * @param {string} text
 */
function copy(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}

function App() {
  const [settingOpen, setSettingOpen] = useState(false);

  const handleCopy = () => {
    const config = storage.get('config') || {
      selector: '.container',
      previewTime: 5,
    };

    const { selector } = config;
    const data = generate(document.querySelector(selector));
    copy(JSON.stringify(data));
  };
  const handlePreview = () => {
    const config = storage.get('config') || {
      selector: '.container',
      previewTime: 5,
    };

    const { selector, previewTime } = config;
    preview(document.querySelector(selector), previewTime);
  };
  const openSetting = () => {
    setSettingOpen(true);
  };

  return (
    <div>
      <FloatButton.Group trigger="click" icon={<AppstoreOutlined />} type="primary" style={{ right: 24 }}>
        <FloatButton icon={<EyeOutlined />} onClick={handlePreview} />
        <FloatButton icon={<CopyOutlined />} onClick={handleCopy} />
        <FloatButton icon={<SettingOutlined onClick={openSetting} />} />
      </FloatButton.Group>
      <Setting
        open={settingOpen}
        onClose={() => {
          setSettingOpen(false);
        }}
      />
    </div>
  );
}

export default toRem(App);
