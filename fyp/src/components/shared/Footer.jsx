import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.jpg";

export default function Footer() {
  return (
    <footer className="bg-[#12201C] text-[#CFE0D9] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-white/10 shrink-0">
                <img
                  src={logoImg}
                  alt="FYPTrack"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <span className="font-['Bricolage_Grotesque'] text-2xl font-bold tracking-tight text-white">
                  FYPTrack
                </span>
                <p className="text-xs text-[#8FA59D]">
                  Intelligent Final Year Project Management System
                </p>
              </div>
            </div>
            <p className="text-sm text-[#8FA59D] max-w-md leading-relaxed">
              An enterprise platform standardizing the FYP lifecycle from topic
              proposal and supervisor allocation to milestone tracking, document
              submissions, and final grading.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center text-xs text-[#EBB44B] font-semibold tracking-wider uppercase">
                Academic Year 2026-2027
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-['Bricolage_Grotesque'] text-sm font-bold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/#features" className="hover:text-[#F59E0B] transition-colors">
                  System Features
                </Link>
              </li>
              <li>
                <Link to="/#roles" className="hover:text-[#F59E0B] transition-colors">
                  User Roles
                </Link>
              </li>
              <li>
                <Link to="/#workflow" className="hover:text-[#F59E0B] transition-colors">
                  Workflow Steps
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-[#F59E0B] transition-colors">
                  Frequently Asked
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-[#F59E0B] transition-colors">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access / Portals */}
          <div>
            <h4 className="font-['Bricolage_Grotesque'] text-sm font-bold text-white uppercase tracking-wider mb-4">
              Access
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-[#F59E0B] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-[#F59E0B] transition-colors">
                  Student Registration
                </Link>
              </li>
              <li>
                <a href="#guidelines" className="hover:text-[#F59E0B] transition-colors">
                  IEEE FYP Guidelines
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-[#F59E0B] transition-colors">
                  Department Coordinator
                </a>
              </li>
              <li>
                <a href="#helpdesk" className="hover:text-[#F59E0B] transition-colors">
                  IT Help Desk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8FA59D]">
          <p>
            &copy; {new Date().getFullYear()} FYPTrack. All university policies and rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">
              Academic Integrity Policy
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Terms of Use
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Privacy Notice
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
