export default function SectionHeading({
  tag,
  title,
  subtitle,
  align = "center", // "center" | "left"
  className = "",
}) {
  const isCenter = align === "center";

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? "text-center max-w-3xl mx-auto" : "max-w-2xl"} ${className}`}>
      {tag && (
        <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#17302A] bg-[#FEF3D6] rounded-full mb-3.5">
          {tag}
        </span>
      )}
      <h2 className="font-['Bricolage_Grotesque'] text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#17302A] tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[#5F6B66] font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
