import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Input, Form, InputNumber } from 'antd';
import * as storage from '../../utils/storage';
import S from './index.module.less';

const config = storage.get('config') || {
  selector: '.lowcode-container',
  previewTime: 5,
};

const initialValues = config;

function Component() {
  const [form] = Form.useForm();

  useEffect(() => {
    chrome.storage.local.set({ config: initialValues });
  }, []);

  return (
    <div className={S.container}>
      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={(_, values) => {
          storage.set('config', values);
          chrome.storage.local.set({ config: values });
        }}
      >
        <Form.Item name="selector" label="选择器(多个时默认选第一个)">
          <Input style={{ width: 200 }} placeholder="请输入选择器" />
        </Form.Item>
        <Form.Item name="previewTime" label="骨架屏预览时长(s)">
          <InputNumber placeholder="请输入骨架屏预览时长" />
        </Form.Item>
      </Form>
    </div>
  );
}

const container = document.querySelector('#root');
if (container) {
  const root = createRoot(container);
  root.render(<Component />);
}
