import { useEffect, useState } from 'react';
import { Kernel } from '@kernel';
import { WindowManager, Dock, Desktop } from '@system';
import DockComponent from './platform/ui/dock';
import styles from './App.module.css';
import MenuBar from './platform/ui/menubar';

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

  return (
    <main className={styles.app}>
      <MenuBar />
      <DockComponent />
    </main>
  );
}
