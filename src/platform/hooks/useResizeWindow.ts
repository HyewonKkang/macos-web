import { WindowManager } from '@system';

export default function useResizeWindow(
  windowRef: React.RefObject<HTMLDivElement | null>,
  windowId: number,
) {
  const wm = WindowManager.getInstance();

  return (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowRef.current?.offsetWidth ?? 0;
    const startHeight = windowRef.current?.offsetHeight ?? 0;

    // 리사이즈 중 CSS transition 비활성화
    if (windowRef.current) {
      windowRef.current.style.transition = 'none';
    }

    let currentWidth = startWidth;
    let currentHeight = startHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      currentWidth = Math.max(200, startWidth + deltaX);
      currentHeight = Math.max(200, startHeight + deltaY);

      // 리사이즈 중에는 직접 DOM 조작으로 성능 최적화
      if (windowRef.current) {
        windowRef.current.style.width = `${currentWidth}px`;
        windowRef.current.style.height = `${currentHeight}px`;
      }
    };

    const handleMouseUp = () => {
      // CSS transition 재활성화
      if (windowRef.current) {
        windowRef.current.style.transition = '';
      }

      // 리사이즈 완료 후 WindowManager에 최종 크기 업데이트
      wm.resizeWindow(windowId, { width: currentWidth, height: currentHeight });

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
}
