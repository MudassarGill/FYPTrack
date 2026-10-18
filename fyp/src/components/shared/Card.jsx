export default function Card({ children, className = "", hover = true, heavy = false, ...props }) {
  const hoverClass = hover ? (heavy ? "card-hover card-heavy" : "card-hover") : "";
  return (
    <div className={`card-base ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
