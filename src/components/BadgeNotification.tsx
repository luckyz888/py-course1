import { useState, useEffect } from 'react';
import type { Badge } from '../types';

interface BadgeNotificationProps {
  badge: Badge | null;
  onClose: () => void;
}

export default function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!badge) return;

    // 触发滑入动画
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [badge, onClose]);

  if (!badge) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      {/* 半透明遮罩 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 弹窗 */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        {/* 徽章图标 */}
        <div className="text-6xl mb-4">{badge.icon}</div>

        {/* 标题 */}
        <h2 className="text-xl font-bold text-[#1e1b4b] mb-2">恭喜获得徽章！</h2>

        {/* 徽章名称和描述 */}
        <p className="text-lg font-semibold text-[#f59e0b] mb-1">{badge.name}</p>
        <p className="text-sm text-gray-500 mb-6">{badge.description}</p>

        {/* 关闭按钮 */}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="px-6 py-2.5 bg-[#f59e0b] text-white font-medium rounded-lg hover:bg-[#d97706] transition-colors"
        >
          太棒了！
        </button>
      </div>
    </div>
  );
}
