import React from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';
import * as storage from '../storage';

interface Props {
  open: boolean;
  onClose: () => void;
}

const config = storage.get('config') || {
  selector: '.container',
  previewTime: 5,
};

const initialValues = config;

export default function Setting(props: Props) {
  const { open, onClose } = props;
  const [form] = Form.useForm();

  return (
    <Modal title="设置" centered cancelText="取消" open={open} footer={null} onCancel={onClose}>
      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={(_, values) => {
          storage.set('config', values);
        }}
      >
        <Form.Item name="selector" label="选择器(多个时默认选第一个)">
          <Input style={{ width: 200 }} placeholder="请输入选择器" />
        </Form.Item>
        <Form.Item name="previewTime" label="骨架屏预览时长(s)">
          <InputNumber placeholder="请输入骨架屏预览时长" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
