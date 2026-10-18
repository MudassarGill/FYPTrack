import Card from "./Card";

export default function StatCard({ label, value, subtext, highlight = false, className = "" }) {
  return (
    <Card className={`p-6 ${highlight ? "border-[#EBB44B] bg-[#FFFDF8]" : "bg-white"} ${className}`}>
      <p className="text-xs font-semibold tracking-wider uppercase text-[#5F6B66] mb-2">{label}</p>
      <div className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#17302A] tracking-tight">
        {value}
      </div>
      {subtext && (
        <p className="mt-2 text-xs text-[#5F6B66] font-medium leading-relaxed">{subtext}</p>
      )}
    </Card>
  );
}
