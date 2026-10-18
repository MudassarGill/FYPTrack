import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="w-full text-[#A9B8B2] text-[14px]"
      style={{ backgroundColor: "#12201C", padding: "44px 24px 36px" }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* 4 Columns (2fr 1fr 1fr 1fr) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 pb-10">
          {/* Column 1 (2fr) */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: "#EBB44B" }}
              />
              <span className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-white tracking-tight">
                FYPTrack
              </span>
            </div>
            <p className="text-[14px] leading-relaxed max-w-sm text-[#A9B8B2]">
              Intelligent Final Year Project Management and Automation System for universities.
            </p>
          </div>

          {/* Column 2: Product (1fr) */}
          <div className="space-y-3">
            <h4 className="font-['Bricolage_Grotesque'] text-white font-bold text-[14px]">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/#features" className="hover:text-[#F59E0B] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-[#F59E0B] transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-[#F59E0B] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals (1fr) */}
          <div className="space-y-3">
            <h4 className="font-['Bricolage_Grotesque'] text-white font-bold text-[14px]">
              Portals
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/student/dashboard" className="hover:text-[#F59E0B] transition-colors">
                  Students
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#F59E0B] transition-colors">
                  Supervisors
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#F59E0B] transition-colors">
                  Coordinators
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact (1fr) */}
          <div className="space-y-3">
            <h4 className="font-['Bricolage_Grotesque'] text-white font-bold text-[14px]">
              Contact
            </h4>
            <ul className="space-y-1.5 text-[14px] text-[#A9B8B2]">
              <li>
                <a href="mailto:fyp@university.edu" className="hover:text-[#F59E0B] transition-colors">
                  fyp@university.edu
                </a>
              </li>
              <li>Computer Science Department</li>
              <li>Main Campus</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#8FA19A]"
          style={{ borderTop: "1px solid #22342F" }}
        >
          <div>&copy; 2026 FYPTrack. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#F59E0B] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#F59E0B] transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
