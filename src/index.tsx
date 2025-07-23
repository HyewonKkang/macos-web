import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DesktopApp from './DesktopApp';
import { Kernel } from '@kernel';

const kernel = Kernel.getInstance();

// React 애플리케이션 먼저 마운트
createRoot(document.getElementById('root')!).render(<DesktopApp />);

// 커널 부팅은 백그라운드에서 진행
kernel.boot().catch((error) => {
  console.error('System failed to start', error);
});
