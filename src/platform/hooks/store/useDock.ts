import { useSyncExternalStore } from 'react';
import { Dock, DockItemType } from '../../../system/dock';

const dock = Dock.getInstance();

function subscribe(callback: () => void) {
  dock.on('dockitem:updated', callback);
  dock.on('dockitem:clicked', callback);

  return () => {
    dock.off('dockitem:updated', callback);
    dock.off('dockitem:clicked', callback);
  };
}

function getSnapshot() {
  return dock.getItems();
}

export function useDock(): DockItemType[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}
