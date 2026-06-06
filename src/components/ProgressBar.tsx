interface ProgressBarProps {
  label: string;
  progress: number;
  color?: string;
}

export default function ProgressBar({ label, progress, color = '#10b981' }: ProgressBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold" style={{ color }}>{progress}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: progress >= 100
              ? `linear-gradient(90deg, ${color}, #34d399)`
              : `linear-gradient(90deg, #f59e0b, #fbbf24)`,
          }}
        />
      </div>
    </div>
  );
}
