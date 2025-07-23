import { Window, WindowManager } from '@system';
import { PropsWithChildren } from 'react';
import styles from './window.module.css';
import WindowControls from './WindowControls';

type Props = {
  window: Window;
};

export default function WindowView({
  window,
  children,
}: PropsWithChildren<Props>) {
  const wm = WindowManager.getInstance();
  const isActive = wm.getActiveWindow()?.id === window.id;

  return (
    <div
      className={`${styles.window} ${isActive ? styles.active : styles.inactive}`}
      onMouseDown={() => wm.focusWindow(window.id)}>
      <div className={styles.titleBar}>
        <WindowControls window={window} />
        <span className={styles.title}>{window.title}</span>
      </div>

      <div className={styles.body}>{children}</div>

      <div className={styles.resizeHandle}></div>
    </div>
  );
}
