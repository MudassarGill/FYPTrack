export default function PageHeader({ title, description, action = null, className = "" }) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-8 border-b border-[#E6E6E1] ${className}`}>
      <div>
        <h1 className="font-['Bricolage_Grotesque'] text-2xl md:text-3xl font-extrabold text-[#17302A] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm md:text-base text-[#5F6B66] font-normal leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
