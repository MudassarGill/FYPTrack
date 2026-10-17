function PageHeader({ eyebrow, title, description, date, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {date && (
          <span className="text-xs text-slate-500">{date}</span>
        )}
        {actions}
      </div>
    </div>
  );
}

export default PageHeader;
