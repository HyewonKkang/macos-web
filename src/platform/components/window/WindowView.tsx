import { Window, WindowManager } from '@system';
import styles from './window.module.css';
import WindowControls from './WindowControls';
import { PropsWithChildren, useRef } from 'react';

type Props = {
  window: Window;
};

export default function WindowView({
  window,
  children,
}: PropsWithChildren<Props>) {
  const wm = WindowManager.getInstance();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} onMouseDown={() => wm.focusWindow(window.id)}>
      <div
        className={styles.titleBar}
        //   onMouseDown={onMouseDown}
      >
        <WindowControls window={window} />
        <span className={styles.title}>{window.title}</span>
      </div>

      <div className={styles.body}>{children}</div>

      <div
        className={styles.resizeHandle}
        // onMouseDown={onResizeMouseDown}
      ></div>
    </div>
  );
}
