import { Kernel } from '@kernel';
import { WindowManager, Window } from '@system';
import { useEffect, useState } from 'react';
import WindowView from '../../components/window/WindowView';
import { AppLaunchService } from '../../../system/appLaunchService';

export default function AppsRenderer() {
  const [windows, setWindows] = useState<Window[]>([]);
  const wm = WindowManager.getInstance();
  const kernel = Kernel.getInstance();
  const appManager = AppLaunchService.getInstance();

  useEffect(() => {
    const handleWindowCreated = (window: Window) => {
      setWindows((prev) => [...prev, window]);
    };

    const handleWindowClosed = (window: Window) => {
      setWindows((prev) => prev.filter((w) => w.id !== window.id));
    };

    wm.on('window:created', handleWindowCreated);
    wm.on('window:closed', handleWindowClosed);

    // 초기 윈도우 목록 가져오기
    setWindows(wm.getWindows());

    return () => {
      wm.off('window:created', handleWindowCreated);
      wm.off('window:closed', handleWindowClosed);
    };
  }, [kernel, wm]);

  return (
    <>
      {windows.map((window) => (
        <WindowView key={window.id} window={window}>
          <AppContent windowId={window.id} />
        </WindowView>
      ))}
    </>
  );
}

function AppContent({ windowId }: { windowId: number }) {
  const wm = WindowManager.getInstance();
  const window = wm.getWindows().find((w) => w.id === windowId);

  console.log('window created!', window, windowId);

  if (!window) return null;

  return <div>App!!!!</div>;

  // // switch (window.appId) {
  // //     case 'com.apple.Safari':
  // //         return <SafariApp />;
  // //     case 'com.apple.TextEdit':
  // //         return <TextEditApp />;
  // //     case 'com.apple.Calendar':
  // //         return <CalendarApp/>;
  // //     case 'com.apple.Calculator':
  // //         return <CalculatorApp />;
  // //     default:
  // //         return <div>Unknown App</div>;
  // }
}
