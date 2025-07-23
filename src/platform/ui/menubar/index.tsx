import { useState } from 'react';
import styles from './MenuBar.module.css';

export default function MenuBar() {
  const [time] = useState<string>(() => formatMenuBarTime(new Date()));

  return (
    <div className={styles.menuBar}>
      <div className={styles.menuBarLeft}>
        <div className={styles.appleIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        </div>
        <div className={styles.menuBarItem}>Finder</div>
        <div className={styles.menuBarItem}>File</div>
        <div className={styles.menuBarItem}>Edit</div>
        <div className={styles.menuBarItem}>View</div>
        <div className={styles.menuBarItem}>Go</div>
        <div className={styles.menuBarItem}>Window</div>
        <div className={styles.menuBarItem}>Help</div>
      </div>

      <div className={styles.menuBarRight}>
        <div className={styles.menuBarIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className={styles.menuBarIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
        </div>
        <div className={styles.menuBarIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        </div>
        <div className={styles.menuBarTime}>{time}</div>
      </div>
    </div>
  );
}

function formatMenuBarTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short', // Wed
    month: 'short', // Jul
    day: '2-digit', // 23
    hour: 'numeric', // 1
    minute: '2-digit', // 23
    hour12: true,
  })
    .format(date)
    .replace(',', '');
}
