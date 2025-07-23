import { Dock, DockItemType } from '@system';
import styles from './Dock.module.css';

type Props = {
  item: DockItemType;
};
export default function DockItem({ item }: Props) {
  const onClick = () => Dock.getInstance().clickItem(item.id);

  return (
    <button className={styles.dockItem} onClick={onClick}>
      <div className={styles.dockItemTooltip}>{item.name}</div>
      <img src={item.icon} alt={item.name} draggable={true} />
      {item.isRunning && <span className={styles.indicator} />}
    </button>
  );
}
