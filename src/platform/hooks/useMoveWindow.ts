import { WindowManager } from '@system';

export default function useMoveWindow(
  windowRef: React.RefObject<HTMLDivElement | null>,
  windowId: number,
) {
  const wm = WindowManager.getInstance();

  return (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const window = wm.getWindows().find((w) => w.id === windowId);

    if (!window || window.isMinimized) return;

    // TODO: 최대화된 상태에서 이동 시도
    if (window.isMaximized) {
      return;
    }

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startWindowX = window.position.x;
    const startWindowY = window.position.y;

    // 이동 중 CSS transition 비활성화
    if (windowRef.current) {
      windowRef.current.style.transition = 'none';
    }

    let currentX = startWindowX;
    let currentY = startWindowY;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startMouseX;
      const deltaY = e.clientY - startMouseY;

      currentX = startWindowX + deltaX;
      currentY = startWindowY + deltaY;

      // 이동 중에는 직접 DOM 조작으로 성능 최적화
      if (windowRef.current) {
        windowRef.current.style.left = `${currentX}px`;
        windowRef.current.style.top = `${currentY}px`;
      }
    };

    const handleMouseUp = () => {
      // CSS transition 재활성화
      if (windowRef.current) {
        windowRef.current.style.transition = '';
      }

      // 이동 완료 후 WindowManager에 최종 위치 업데이트
      wm.moveWindow(windowId, { x: currentX, y: currentY });

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
}
