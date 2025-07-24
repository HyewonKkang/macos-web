import { Kernel } from '@kernel';
import { Desktop, Dock, WindowManager } from '@system';
import { AppLaunchService } from './system/appLaunchService';
import { useEffect, useState } from 'react';
import styles from './App.module.css';
import DockComponent from './platform/ui/dock';
import MenuBar from './platform/ui/menubar';
import WindowsRenderer from './platform/components/window/WindowsRenderer';

export default function DesktopApp() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const kernel = Kernel.getInstance();
    const windowManager = WindowManager.getInstance();
    const desktop = Desktop.getInstance();
    const dock = Dock.getInstance();
    const appLaunchService = AppLaunchService.getInstance(); // AppLaunchService 초기화

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

  return (
    <main className={styles.app}>
      <MenuBar />
      <WindowsRenderer />
      <DockComponent />
    </main>
  );
}
