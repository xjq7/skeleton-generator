import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';

export default function Example() {
  return <RouterProvider router={router} />;
}

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Example />);
