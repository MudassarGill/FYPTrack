export default function ProgressBar({
  value = 0,
  max = 100,
  label = "",
  showPercentage = true,
  color = "ink", // "ink" or "amber"
  height = "h-2.5",
  className = "",
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const fillColor = color === "amber" ? "bg-[#EBB44B]" : "bg-[#17302A]";

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-[#5F6B66]">
          {label && <span>{label}</span>}
          {showPercentage && <span className="ml-auto text-[#17302A] font-bold">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-[#E6E9E6] rounded-full overflow-hidden`}>
        <div
          className={`${height} ${fillColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
