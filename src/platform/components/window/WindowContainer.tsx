import { WindowManager, Window } from '@system';
import { useEffect, useState } from 'react';
import WindowView from './WindowView';

export default function WindowContainer() {
  const windows = useWindows();

  return (
    <>
      {windows.map((window) =>
        !window.visible ? null : <WindowView key={window.id} window={window} />,
      )}
    </>
  );
}

function useWindows() {
  const wm = WindowManager.getInstance();
  const [windows, setWindows] = useState<Window[]>([]);

  useEffect(() => {
    const sync = () => setWindows(wm.getWindows());

    sync();

    const events =
      'window:created window:moved window:resized window:closed window:blur window:focused window:maximized window:minimized window:restored'.split(
        ' ',
      );

    events.forEach((event) => wm.on(event, sync));
    return () => events.forEach((event) => wm.off(event, sync));
  }, []);

  return windows;
}
