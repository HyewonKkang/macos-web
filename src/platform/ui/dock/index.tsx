import { useDock } from '../../hooks/store/useDock';
import DockItem from './DockItem';
import type { DockItemType } from '@system';
import styles from './Dock.module.css';

export default function Dock() {
  const items = useDock();

  return (
    <div className={styles.dock}>
      <nav className={styles.dockBar}>
        {items.map((item: DockItemType) => (
          <DockItem key={item.id} item={item} />
        ))}
      </nav>
    </div>
  );
}
