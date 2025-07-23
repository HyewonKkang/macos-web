import { WindowManager, Window } from '@system';
import styles from './window.module.css';

export default function WindowControls({ window }: { window: Window }) {
  const wm = WindowManager.getInstance();

  return (
    <div className={styles.controls}>
      <button
        className={styles.close}
        onClick={(e) => {
          e.stopPropagation();
          wm.closeWindow(window.id);
        }}
      />
      <button
        className={styles.minimize}
        onClick={(e) => {
          e.stopPropagation();
          wm.minimizeWindow(window.id);
        }}
      />
      <button
        className={styles.maximize}
        onClick={(e) => {
          e.stopPropagation();
          wm.maximizeWindow(window.id);
        }}
      />
    </div>
  );
}
