import { Window, WindowManager } from '@system';
import { useSyncExternalStore } from 'react';

const wm = WindowManager.getInstance();

function subscribe(callback: () => void) {
  const events =
    'window:created window:moved window:resized window:closed window:blur window:focused window:maximized window:minimized window:restored'.split(
      ' ',
    );
  events.forEach((e) => wm.on(e, callback));
  return () => events.forEach((e) => wm.off(e, callback));
}

function getSnapshot() {
  return wm.getWindows();
}

export function useWindows(): Window[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}
