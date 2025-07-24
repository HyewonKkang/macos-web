import { WindowManager } from '@system';
import WindowView from './WindowView';
import { useWindows } from '../../hooks/store/useWindows';
import styles from './window.module.css';

export default function WindowsRenderer() {
  const windows = useWindows();

  return (
    <div className={styles.windowsRenderer}>
      {windows.map((window) =>
        !window.visible ? null : (
          <WindowView key={window.id} window={window}>
            {renderApp(window.id)}
          </WindowView>
        ),
      )}
    </div>
  );
}

function renderApp(windowId: number) {
  const wm = WindowManager.getInstance();
  const window = wm.getWindows().find((w) => w.id === windowId);

  if (!window) {
    return null;
  }

  return <>App!!!!</>;

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
