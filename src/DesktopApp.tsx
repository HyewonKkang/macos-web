import { useEffect, useState } from 'react';
import './App.css';
import { Kernel } from '@kernel';
import { WindowManager, Dock, Desktop } from '@system';

export default function DesktopApp() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const kernel = Kernel.getInstance();
    const windowManager = WindowManager.getInstance();
    const desktop = Desktop.getInstance();
    const dock = Dock.getInstance();

    const onKernelReady = () => {
      setIsReady(true);
    };

    kernel.on('kernel:ready', onKernelReady);

    return () => {
      kernel.off('kernel:ready', onKernelReady);
    };
  }, []);

  if (!isReady) {
    // 부팅 화면
    return <div>Booting...</div>;
  }

  return <div>Desktop</div>;
}
