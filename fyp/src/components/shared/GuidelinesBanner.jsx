import { useToast } from "./Toast";

export default function GuidelinesBanner({ className = "" }) {
  const { addToast } = useToast();
  return (
    <div
      className={`relative overflow-hidden text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${className}`}
      style={{
        background: "linear-gradient(120deg, #B91C1C, #7F1D1D)",
        borderRadius: "18px",
        padding: "38px 40px",
        boxShadow: "0 16px 36px rgba(127,29,29,.38)",
      }}
    >
      {/* Faint translucent white circle (240px, 8% opacity) at top-right */}
      <div
        className="absolute -top-12 -right-12 w-[240px] h-[240px] rounded-full bg-white opacity-[0.08] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[620px]">
        <h3 className="font-['Bricolage_Grotesque'] text-[22px] font-bold tracking-tight mb-1.5">
          Read the FYP Guidelines
        </h3>
        <p className="text-[14px] leading-relaxed text-[#FDE2E2]">
          Check the submission rules, plagiarism policy and evaluation criteria before every deadline.
        </p>
      </div>

      <div className="relative z-10 shrink-0">
        <button
          type="button"
          onClick={() => addToast("FYP Guidelines document (PDF) download initiated.", "info")}
          className="rounded-[10px] bg-white text-[#7F1D1D] font-bold text-[14px] px-[22px] py-[12px] hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
        >
          Read Guidelines
        </button>
      </div>
    </div>
  );
}
