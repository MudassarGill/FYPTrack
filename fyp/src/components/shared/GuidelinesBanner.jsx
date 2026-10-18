import { useState } from "react";

export default function GuidelinesBanner({
  title = "FYP Official Guidelines & Submission Deadlines",
  message = "Please review the updated IEEE format requirements and milestone submission deadlines for Spring 2026. Submissions past the deadline require department approval.",
  actionText = "Download Guidelines",
  actionHref = "#",
  dismissible = true,
  className = "",
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#7F1D1D] text-white p-4 sm:p-5 shadow-md ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-white opacity-90 animate-pulse" />
            <h4 className="font-['Bricolage_Grotesque'] text-sm sm:text-base font-bold tracking-tight">
              {title}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-red-100 font-normal leading-relaxed">
            {message}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {actionText && (
            <a
              href={actionHref}
              className="inline-block px-3.5 py-1.5 text-xs font-semibold bg-white text-[#7F1D1D] hover:bg-red-50 rounded-lg transition-colors duration-150 shadow-sm"
            >
              {actionText}
            </a>
          )}
          {dismissible && (
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="px-2.5 py-1.5 text-xs font-medium text-red-200 hover:text-white transition-colors"
              aria-label="Dismiss banner"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
