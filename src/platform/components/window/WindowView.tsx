import { WindowManager, Window as WindowType } from '@system';
import { PropsWithChildren, useRef } from 'react';
import styles from './window.module.css';
import WindowControls from './WindowControls';
import useResizeWindow from '../../hooks/useResizeWindow';
import useMoveWindow from '../../hooks/useMoveWindow';

type Props = {
  window: WindowType;
};

export default function WindowView({
  window,
  children,
}: PropsWithChildren<Props>) {
  const windowRef = useRef<HTMLDivElement>(null);
  const wm = WindowManager.getInstance();
  const { id, isMaximized, isMinimized, title, size, position, zIndex } =
    window;
  const isActive = wm.getActiveWindow()?.id === id;

  const handleResizeStart = useResizeWindow(windowRef, id);
  const handleMoveStart = useMoveWindow(windowRef, id);

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${isActive ? styles.active : styles.inactive} ${
        isMaximized ? styles.maximized : ''
      } ${isMinimized ? styles.minimized : ''}`}
      style={
        isMaximized || isMinimized
          ? { zIndex: zIndex }
          : {
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
              zIndex: zIndex,
            }
      }
      onMouseDown={() => wm.focusWindow(id)}>
      <div
        className={styles.titleBar}
        onMouseDown={(e) => {
          wm.focusWindow(id);
          handleMoveStart(e);
        }}>
        <WindowControls window={window} />
        <span className={styles.title}>{title}</span>
      </div>

      <div className={styles.body}>{children}</div>

      <div className={styles.resizeHandle} onMouseDown={handleResizeStart} />
    </div>
  );
}
