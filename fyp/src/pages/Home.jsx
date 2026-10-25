import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { useToast } from "../components/shared/Toast";

import proposalImg from "../assets/proposal.jpg";
import milestonesImg from "../assets/milestones.jpg";
import matchingImg from "../assets/matching.jpg";
import similarityImg from "../assets/similarity.jpg";
import feedbackImg from "../assets/feedback.jpg";
import reportsImg from "../assets/reports.jpg";

const stats = [
  { big: "3 portals", text: "Student, supervisor, coordinator" },
  { big: "1 platform", text: "Proposals to final evaluation" },
  { big: "AI-assisted", text: "Supervisor matching and similarity" },
  { big: "Real time", text: "Progress and deadline tracking" },
];

const features = [
  { title: "Proposal management", text: "Students submit, supervisors review, coordinators decide. Every status is visible.", img: proposalImg },
  { title: "Milestones and deadlines", text: "Set deadlines once. Students see what is due and supervisors see who is late.", img: milestonesImg },
  { title: "AI supervisor matching", text: "Recommendations based on topic fit and workload. The coordinator makes the final call.", img: matchingImg },
  { title: "Similarity check", text: "Compare new proposals with earlier projects before approval.", img: similarityImg },
  { title: "Feedback in one thread", text: "Comments stay attached to the work they belong to.", img: feedbackImg },
  { title: "Department reports", text: "Progress by stage, supervisor load and pending decisions at a glance.", img: reportsImg },
];

const roles = [
  {
    title: "Students",
    badge: "Student Portal",
    text: "Submit your idea, follow milestones and hear back from your supervisor.",
    items: ["Proposal and project details", "Milestones and deadlines", "Document uploads", "Supervisor feedback"],
  },
  {
    title: "Supervisors",
    badge: "Supervisor Portal",
    text: "Review work and guide the students assigned to you.",
    items: ["Assigned students", "Proposal and document review", "Progress monitoring", "Evaluation and marks"],
  },
  {
    title: "FYP Coordinators",
    badge: "Department Admin",
    text: "Run the whole programme with a clear view of every project.",
    items: ["Proposal decisions", "AI supervisor recommendations", "Similarity analysis", "Reports and analytics"],
    dark: true,
  },
];

const steps = [
  { title: "Sign in", text: "Log in with your university account and land in your own portal." },
  { title: "Submit a proposal", text: "Describe your idea. A similarity check runs before review." },
  { title: "Get a supervisor", text: "The coordinator reviews AI recommendations and assigns one." },
  { title: "Build and report", text: "Upload work, hit milestones and collect feedback until evaluation." },
];

const without = [
  "Proposals lost in email threads",
  "Deadlines tracked in spreadsheets",
  "Supervisor load unknown until it is too late",
  "Feedback scattered across WhatsApp",
];
const withUs = [
  "Every proposal and status in one place",
  "Automatic deadlines and reminders",
  "Live supervisor workload and AI suggestions",
  "Feedback attached to the work itself",
];

const homeFAQ = [
  {
    q: "Who can create an account?",
    a: "Students sign up themselves. Supervisor and coordinator accounts are created by the department.",
  },
  {
    q: "Can students see each other's projects?",
    a: "No. Every user only sees data that belongs to their role and their own project.",
  },
  {
    q: "Does AI decide the supervisor?",
    a: "No. AI suggests matches and the coordinator makes the final decision.",
  },
  {
    q: "Which files can I upload?",
    a: "PDF, Word, PowerPoint and ZIP files up to 20 MB.",
  },
];

// SVG Icons for Contact rows (stroke-based, no emoji/symbols)
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}

const contactRows = [
  { label: "Email", value: "anshbaengineer@gmail.com", icon: <MailIcon /> },
  { label: "Office hours", value: "Mon to Fri, 9:00 to 17:00", icon: <ClockIcon /> },
  { label: "Department", value: "Computer Science, Main Campus", icon: <BuildingIcon /> },
];

const WRAP = "max-w-[1100px] mx-auto px-6";
const H2 = "font-['Bricolage_Grotesque'] text-[42px] font-bold leading-tight mb-1.5 text-[#17302A]";

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const { addToast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    addToast("Message received! The FYP Committee will get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const scrollToHow = (e) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#17302A] flex flex-col font-['Figtree'] [overflow-x:clip]">
      {/* Navbar mode="public" */}
      <Navbar mode="public" />

      {/* ===================== 1. HERO ===================== */}
      <section className={`${WRAP} pt-10 pb-12`}>
        <div
          className="rounded-[28px] shadow-[0_30px_60px_rgba(23,48,42,.35)] relative"
          style={{
            padding: "56px 24px 56px 48px",
            background:
              "radial-gradient(circle at 94% 112%, rgba(235,180,75,.18) 0, rgba(235,180,75,.18) 190px, transparent 191px), linear-gradient(135deg, #17302A, #24493F)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* LEFT: text sits directly on the green with no inner glass box */}
            <div>
              <span className="inline-block bg-white text-[#17302A] border border-[#E6E6E1] rounded-full px-3 py-1.5 text-[12px] font-semibold mb-4">
                For FYP students, supervisors and coordinators
              </span>
              <h1 className="font-['Bricolage_Grotesque'] font-extrabold text-white text-[40px] sm:text-[50px] lg:text-[66px] leading-[1.02] tracking-[-1.5px] my-5">
                Every final year project, tracked in one place.
              </h1>
              <p className="text-[17px] leading-[1.7] max-w-[460px] text-[#D5E3DD]">
                Proposals, supervisors, milestones, documents and feedback, without spreadsheets and WhatsApp groups. FYPTrack keeps the whole department on the same page.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-7">
                <Link
                  to="/signup"
                  className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors shadow-sm"
                >
                  Create your account
                </Link>
                <a
                  href="#how-it-works"
                  onClick={scrollToHow}
                  className="rounded-[10px] border-[1.5px] border-white/55 hover:bg-white/10 text-white font-bold text-[14px] px-[18px] py-[11px] transition-colors"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* RIGHT: white card shifted right with translateX(64px) so it sticks out past right edge */}
            <div className="bg-white text-[#17302A] border border-[#E6E6E1] rounded-[20px] p-[26px] shadow-[0_30px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 lg:translate-x-16">
              <div className="flex justify-between items-start gap-2.5">
                <div>
                  <div className="text-[17px] font-bold">Crop price predictor</div>
                  <div className="text-[13px] text-[#5F6B66]">Ayesha Noor, Group 14</div>
                </div>
                <span className="rounded-full bg-[#E1F4EA] text-[#0B5A3E] text-[12px] font-semibold px-2.5 py-[3px] whitespace-nowrap">
                  Proposal approved
                </span>
              </div>

              {/* Progress rows Literature review 100%, System design 70%, Prototype demo 20% (all fills #17302A) */}
              <div className="mt-5 space-y-3.5">
                {[
                  ["Literature review", 100],
                  ["System design", 70],
                  ["Prototype demo", 20],
                ].map(([name, pct]) => (
                  <div key={name}>
                    <div className="flex justify-between text-[13px] py-1">
                      <span>{name}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-[#E6E9E6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#17302A] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Soft amber box with dark Approve button */}
              <div className="mt-6 bg-[#FEF3D6] border border-[#F3DFAE] rounded-xl p-4 flex justify-between items-center gap-3">
                <div>
                  <div className="text-[13px] text-[#6B4700]">Suggested supervisor</div>
                  <div className="font-bold text-[15px] text-[#17302A]">Dr. Imran Shah</div>
                  <div className="text-[13px] text-[#5F6B66]">92% topic match, 2 free slots</div>
                </div>
                <button
                  type="button"
                  onClick={() => addToast("Supervisor assignment sample approved.")}
                  className="rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white font-bold text-[14px] px-[18px] py-[11px] transition-colors cursor-pointer"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 2. STATS ===================== */}
      <section className={`${WRAP} pt-2 pb-12`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.big}
              className="card-base text-left transition-transform duration-300"
            >
              <div className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
                {s.big}
              </div>
              <div className="text-[13px] text-[#5F6B66] mt-1">{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 3. FEATURES ===================== */}
      <section id="features" className={`${WRAP} py-[72px]`}>
        <h2 className={H2}>Features</h2>
        <p className="text-[#5F6B66] mb-7">Everything a department needs to run final year projects.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="img-box group">
              <div className="h-[170px] overflow-hidden">
                <img
                  src={f.img}
                  alt={f.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-[22px] pt-[20px] pb-[24px]">
                <h3 className="img-box-title font-['Bricolage_Grotesque'] text-[18px] font-bold mb-2 text-[#17302A] transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="text-[14px] text-[#5F6B66] leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 4. ROLES ===================== */}
      <section id="roles" className={`${WRAP} pb-[72px]`}>
        <h2 className={H2}>Roles</h2>
        <p className="text-[#5F6B66] mb-7">Each user sees only what their role allows.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <div
              key={r.title}
              className={`rounded-[16px] p-6 card-base card-heavy flex flex-col justify-between ${
                r.dark
                  ? "card-dark !bg-[#17302A] text-white border-[#17302A]"
                  : "bg-white text-[#17302A] border-[#E6E6E1]"
              }`}
              style={r.dark ? { backgroundColor: "#17302A", color: "#FFFFFF", borderColor: "#17302A" } : {}}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      r.dark
                        ? "bg-[#EBB44B]/20 text-[#F6D88E] border border-[#EBB44B]/30"
                        : "bg-[#E1F4EA] text-[#0B5A3E]"
                    }`}
                  >
                    {r.badge}
                  </span>
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-[22px] font-bold mb-2">
                  {r.title}
                </h3>
                <p className={`text-[14px] leading-relaxed mb-4 ${r.dark ? "text-[#C5D4CD]" : "text-[#5F6B66]"}`}>
                  {r.text}
                </p>
              </div>
              <ul className="mt-2">
                {r.items.map((item) => (
                  <li
                    key={item}
                    className={`text-[14px] py-[11px] pr-0 pl-[24px] ${
                      r.dark ? "fy-check fy-check-dark text-[#D5E3DD]" : "fy-check text-[#5F6B66]"
                    }`}
                    style={{
                      borderTop: r.dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #EEEEEA",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 5. HOW IT WORKS (FULL-WIDTH BAND) ===================== */}
      <section id="how-it-works" className="w-full py-[72px]" style={{ backgroundColor: "#17302A" }}>
        <div className={WRAP}>
          <h2 className="font-['Bricolage_Grotesque'] text-[42px] font-bold leading-tight mb-6 text-white">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="bg-white text-[#17302A] border border-[#E6E6E1] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2"
                style={{
                  boxShadow: "0 12px 28px rgba(0,0,0,.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 36px 64px rgba(0,0,0,.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,.15)";
                }}
              >
                <div className="w-[44px] h-[44px] rounded-full bg-[#EBB44B] text-[#17302A] font-['Bricolage_Grotesque'] text-xl font-extrabold flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <div className="font-['Bricolage_Grotesque'] text-[18px] font-bold mb-1.5">
                  {s.title}
                </div>
                <p className="text-[14px] text-[#5F6B66] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 6. WHY FYPTRACK ===================== */}
      <section className={`${WRAP} py-[72px]`}>
        <h2 className={`${H2} !mb-6`}>Why FYPTrack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Without FYPTrack */}
          <div className="card-base card-heavy bg-white border-[#E6E6E1] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  Without FYPTrack
                </h3>
                
              </div>
              <ul className="space-y-3.5">
                {without.map((i) => (
                  <li key={i} className="fy-dash text-[14px] text-[#5F6B66] leading-relaxed">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* With FYPTrack */}
          <div
            className="card-base card-dark card-heavy !bg-[#17302A] border-[#17302A] text-white p-6 flex flex-col justify-between"
            style={{ backgroundColor: "#17302A", color: "#FFFFFF", borderColor: "#17302A" }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-white">
                  With FYPTrack
                </h3>
                
              </div>
              <ul className="space-y-3.5">
                {withUs.map((i) => (
                  <li key={i} className="fy-check fy-check-dark text-[14px] text-[#D5E3DD] leading-relaxed">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 7. FAQ ===================== */}
      <section id="faq" className={`${WRAP} pb-[72px]`}>
        <h2 className={H2}>FAQ</h2>
        <p className="text-[#5F6B66] mb-6">Quick answers before you start.</p>
        <div className="space-y-3 max-w-[650px]">
          {homeFAQ.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="bg-white border border-[#E6E6E1] rounded-[12px] px-[22px] py-[18px] transition-shadow"
                style={{
                  boxShadow: "0 12px 28px rgba(23,48,42,.08)",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center gap-4 text-left font-['Bricolage_Grotesque'] font-bold text-[16px] text-[#17302A] cursor-pointer focus:outline-none"
                >
                  <span>{item.q}</span>
                  <span className="text-[20px] font-bold text-[#5F6B66] shrink-0" aria-hidden="true">
                    {isOpen ? "\u2212" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-[14px] text-[#5F6B66] leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== 8. CONTACT ===================== */}
      <section id="contact" className={`${WRAP} pb-[72px]`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Info */}
          <div>
            <h2 className={H2}>Contact</h2>
            <p className="text-[#5F6B66] mb-6">
              Questions about setting up FYPTrack for your department? Send us a message.
            </p>
            <div className="space-y-4">
              {contactRows.map((c) => (
                <div key={c.label} className="flex items-center gap-3.5">
                  <div
                    className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#E1EFE8", color: "#17302A" }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-[#17302A]">{c.label}</div>
                    <div className="text-[13px] text-[#5F6B66]">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Form box (white, radius 16px, padding 26px, soft shadow, no lift on hover) */}
          <form
            onSubmit={handleContactSubmit}
            className="card-static"
          >
            <div>
              <label htmlFor="c-name" className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Full name
              </label>
              <input
                id="c-name"
                type="text"
                required
                placeholder="Your name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
            </div>

            <div className="mt-3.5">
              <label htmlFor="c-email" className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Email
              </label>
              <input
                id="c-email"
                type="email"
                required
                placeholder="name@university.edu"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
            </div>

            <div className="mt-3.5">
              <label htmlFor="c-msg" className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Message
              </label>
              <textarea
                id="c-msg"
                rows={4}
                required
                placeholder="How can we help?"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
              />
            </div>

            <button
              type="submit"
              className="block w-full mt-5 rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors cursor-pointer"
            >
              Send message
            </button>
          </form>
        </div>
      </section>

      {/* ===================== 9. CTA ===================== */}
      <section className={WRAP}>
        <div
          className="w-full text-white text-center rounded-[22px] px-6 py-16 mb-[72px]"
          style={{ backgroundColor: "#17302A" }}
        >
          <h2 className="font-['Bricolage_Grotesque'] text-[28px] sm:text-[42px] font-bold leading-tight mb-2.5">
            Ready to leave the spreadsheets behind?
          </h2>
          <p className="text-[#C5D4CD] mb-6 text-[15px]">Set up your department in minutes.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors shadow-sm"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="rounded-[10px] border border-white/35 hover:bg-white/10 text-white font-bold text-[14px] px-[18px] py-[11px] transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== 10. FOOTER ===================== */}
      <Footer />
    </div>
  );
}