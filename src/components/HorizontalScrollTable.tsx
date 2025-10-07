import React, { useRef, useEffect, useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight, Move } from 'lucide-react';

interface HorizontalScrollTableProps {
  children: React.ReactNode;
  className?: string;
  tableMinWidth?: string;
  maxHeight?: string;
}

const HorizontalScrollTable: React.FC<HorizontalScrollTableProps> = ({
  children,
  className = '',
  tableMinWidth = '1600px',
  maxHeight = '70vh'
}) => {
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Cập nhật trạng thái cuộn mượt mà
  const updateScrollState = useCallback(() => {
    if (tableScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      
      setCanScrollLeft(scrollLeft > 1); // Thêm tolerance nhỏ
      setCanScrollRight(scrollLeft < maxScroll - 1);
      setScrollPercentage(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
    }
  }, []);

  // Đồng bộ cuộn từ thanh trên xuống bảng với RAF
  const handleTopScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      if (topScrollRef.current && tableScrollRef.current) {
        tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
        updateScrollState();
      }
    });
  }, [updateScrollState]);

  // Đồng bộ cuộn từ bảng lên thanh trên với RAF
  const handleTableScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      if (topScrollRef.current && tableScrollRef.current) {
        topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
        updateScrollState();
      }
    });
  }, [updateScrollState]);

  // Cuộn bằng nút
  const scrollLeft = () => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Handle drag scrollbar thumb
  const handleThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const scrollElement = tableScrollRef.current;
    if (!scrollElement) return;

    const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth;
    const startScrollLeft = scrollElement.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const scrollRatio = deltaX / (scrollElement.clientWidth - 50); // 50px for thumb width
      const newScrollLeft = Math.max(0, Math.min(maxScroll, startScrollLeft + (scrollRatio * maxScroll)));
      
      scrollElement.scrollLeft = newScrollLeft;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Thiết lập chiều rộng của thanh cuộn trên bằng với chiều rộng bảng
  useEffect(() => {
    const updateScrollWidth = () => {
      if (topScrollRef.current && tableScrollRef.current) {
        const tableWidth = tableScrollRef.current.scrollWidth;
        const scrollbarDiv = topScrollRef.current.firstChild as HTMLElement;
        if (scrollbarDiv) {
          scrollbarDiv.style.width = `${tableWidth}px`;
        }
      }
      updateScrollState();
    };

    // Cập nhật khi component mount và khi window resize
    updateScrollWidth();
    const resizeObserver = new ResizeObserver(updateScrollWidth);
    
    if (tableScrollRef.current) {
      resizeObserver.observe(tableScrollRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      // Cleanup RAF khi component unmount
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateScrollState]);

  // Setup passive scroll listeners for better performance
  useEffect(() => {
    const topElement = topScrollRef.current;
    const tableElement = tableScrollRef.current;
    
    if (topElement && tableElement) {
      // Remove default listeners and add passive ones
      const topScrollHandler = () => {
        handleTopScroll();
      };
      
      const tableScrollHandler = () => {
        handleTableScroll();
      };
      
      topElement.addEventListener('scroll', topScrollHandler, { passive: true });
      tableElement.addEventListener('scroll', tableScrollHandler, { passive: true });
      
      return () => {
        topElement.removeEventListener('scroll', topScrollHandler);
        tableElement.removeEventListener('scroll', tableScrollHandler);
      };
    }
  }, [handleTopScroll, handleTableScroll]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full ${className}`}>
      {/* Header với thanh cuộn và controls */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        {/* Thanh điều khiển */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">
              Cuộn ngang để xem thêm cột
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{Math.round(scrollPercentage)}%</span>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-200"
                  style={{ width: `${scrollPercentage}%` }}
                />
              </div>
            </div>
            
            {/* Scroll buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`scroll-button p-1.5 rounded-md ${
                  canScrollLeft 
                    ? 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm border border-gray-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title="Cuộn trái"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`scroll-button p-1.5 rounded-md ${
                  canScrollRight 
                    ? 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm border border-gray-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title="Cuộn phải"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Thanh cuộn custom - ẩn scrollbar gốc và dùng custom */}
        <div className="relative px-4 pb-3">
          {/* Hidden native scrollbar for sync */}
          <div
            ref={topScrollRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide"
            style={{ height: '1px', marginBottom: '8px' }}
          >
            <div style={{ width: tableMinWidth, height: '1px' }} />
          </div>
          
          {/* Custom visual scrollbar track */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full progress-bar shadow-sm cursor-pointer"
              style={{ 
                width: `${Math.max(8, (tableScrollRef.current?.clientWidth || 0) / (parseInt(tableMinWidth.replace('px', '')) || 1600) * 100)}%`,
                transform: `translateX(${scrollPercentage * (100 - Math.max(8, (tableScrollRef.current?.clientWidth || 0) / (parseInt(tableMinWidth.replace('px', '')) || 1600) * 100)) / 100}%)`
              }}
              onMouseDown={handleThumbMouseDown}
            />
          </div>
        </div>
      </div>

      {/* Bảng chính */}
      <div
        ref={tableScrollRef}
        className="overflow-x-auto w-full scroll-smooth-custom custom-scrollbar"
        style={{ maxHeight }}
      >
        <table className="w-full table-fixed divide-y divide-gray-200" style={{ minWidth: tableMinWidth }}>
          {children}
        </table>
      </div>

      {/* Bottom scroll indicators */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            {canScrollLeft && (
              <div className="flex items-center gap-1 scroll-indicator">
                <ChevronLeft className="w-3 h-3" />
                <span>Còn cột bên trái</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {canScrollRight && (
              <div className="flex items-center gap-1 scroll-indicator">
                <span>Còn cột bên phải</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollTable;