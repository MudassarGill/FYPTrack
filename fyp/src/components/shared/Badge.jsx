export default function Badge({ children, variant = "gray", size = "md", className = "" }) {
  const variantStyles = {
    green: "bg-[#E1F4EA] text-[#0B5A3E]",
    amber: "bg-[#FEF3D6] text-[#6B4700]",
    blue: "bg-[#E3EEF9] text-[#1E3A8A]",
    gray: "bg-[#ECECE8] text-[#4A5651]",
    // Convenience aliases
    approved: "bg-[#E1F4EA] text-[#0B5A3E]",
    completed: "bg-[#E1F4EA] text-[#0B5A3E]",
    in_progress: "bg-[#FEF3D6] text-[#6B4700]",
    pending: "bg-[#FEF3D6] text-[#6B4700]",
    submitted: "bg-[#E3EEF9] text-[#1E3A8A]",
    upcoming: "bg-[#ECECE8] text-[#4A5651]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-semibold rounded-full",
    md: "px-3 py-1 text-xs font-semibold rounded-full",
    lg: "px-3.5 py-1.5 text-sm font-semibold rounded-full",
  };

  const appliedVariant = variantStyles[variant] || variantStyles.gray;
  const appliedSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span className={`inline-flex items-center font-medium capitalize tracking-wide ${appliedVariant} ${appliedSize} ${className}`}>
      {children}
    </span>
  );
}
