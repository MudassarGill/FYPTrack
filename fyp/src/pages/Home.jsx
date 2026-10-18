import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

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
  { title: "Students", text: "Submit your idea, follow milestones and hear back from your supervisor.", items: ["Proposal and project details", "Milestones and deadlines", "Document uploads", "Supervisor feedback"] },
  { title: "Supervisors", text: "Review work and guide the students assigned to you.", items: ["Assigned students", "Proposal and document review", "Progress monitoring", "Evaluation and marks"] },
  { title: "FYP Coordinators", text: "Run the whole programme with a clear view of every project.", items: ["Proposal decisions", "AI supervisor recommendations", "Similarity analysis", "Reports and analytics"], dark: true },
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
  { q: "Who can create an account?", a: "Students sign up themselves. Supervisor and coordinator accounts are created by the department." },
  { q: "Can students see each other's projects?", a: "No. Every user only sees data that belongs to their role and their own project." },
  { q: "Does AI decide the supervisor?", a: "No. AI suggests matches and the coordinator makes the final decision." },
  { q: "Which files can I upload?", a: "PDF, Word, PowerPoint and ZIP files up to 20 MB." },
];

// shared box styles (same shadow and hover as the design)
const BASE =
  "border rounded-2xl shadow-[0_12px_28px_rgba(23,48,42,0.14),0_3px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-2";
const HEAVY = "hover:shadow-[0_36px_64px_rgba(23,48,42,0.32)]";
const WRAP = "max-w-[1100px] mx-auto px-6";
const H2 = "font-['Bricolage_Grotesque'] text-[42px] font-bold leading-tight mb-1.5";
const INPUT =
  "w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-sm outline-none focus:border-[#C88F1A] focus:ring-2 focus:ring-[#EBB44B]";
const LABEL = "block text-[13px] font-semibold mt-3.5 mb-1.5";

function Ico({ d }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const contactInfo = [
  { label: "Email", value: "fyp@university.edu", d: "M4 6h16v12H4zM4 7l8 6 8-6" },
  { label: "Office hours", value: "Mon to Fri, 9:00 to 17:00", d: "M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Department", value: "Computer Science, Main Campus", d: "M16 11a3 3 0 100-6M8 11a3 3 0 100-6M2 20c0-3 3-5 6-5s6 2 6 5M16 15c3 0 6 2 6 5" },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const scrollToHow = (e) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#17302A] flex flex-col font-['Figtree'] [overflow-x:clip]">
      <Navbar mode="public" />

      {/* ============ HERO ============ */}
      <section className={`${WRAP} pt-10 pb-12`}>
        <div
          className="rounded-[28px] px-5 py-8 lg:pl-12 lg:pr-6 lg:py-14"
          style={{
            background:
              "radial-gradient(circle at 94% 112%, rgba(235,180,75,.18) 0, rgba(235,180,75,.18) 190px, transparent 191px), linear-gradient(135deg,#17302A,#24493F)",
            boxShadow: "0 30px 60px rgba(23,48,42,.35)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* left: text directly on the green */}
            <div>
              <span className="inline-block bg-white border border-[#E6E6E1] rounded-full px-3 py-1.5 text-xs text-[#17302A]">
                For FYP students, supervisors and coordinators
              </span>
              <h1 className="font-['Bricolage_Grotesque'] font-extrabold text-white text-[40px] lg:text-[66px] leading-[1.02] tracking-[-1.5px] my-[22px]">
                Every final year project, tracked in one place.
              </h1>
              <p className="text-[17px] leading-[1.7] max-w-[460px] text-[#D5E3DD]">
                Proposals, supervisors, milestones, documents and feedback, without spreadsheets and WhatsApp groups. FYPTrack keeps the whole department on the same page.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link
                  to="/signup"
                  className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-sm px-[18px] py-[11px] transition-colors"
                >
                  Create your account
                </Link>
                <a
                  href="#how-it-works"
                  onClick={scrollToHow}
                  className="rounded-[10px] border-[1.5px] border-white/55 hover:bg-white/10 text-white font-bold text-sm px-[18px] py-[11px] transition-colors"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* right: white card, shifted right so it sticks out of the green box */}
            <div className="bg-white text-[#17302A] border border-[#E6E6E1] rounded-[20px] p-[26px] shadow-[0_30px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 lg:translate-x-16 lg:hover:-translate-y-1.5">
              <div className="flex justify-between items-start gap-2.5">
                <div>
                  <div className="text-[17px] font-bold">Crop price predictor</div>
                  <div className="text-[13px] text-[#5F6B66]">Ayesha Noor, Group 14</div>
                </div>
                <span className="rounded-full bg-[#E1F4EA] text-[#0B5A3E] text-xs font-semibold px-2.5 py-[3px] whitespace-nowrap">
                  Proposal approved
                </span>
              </div>

              <div className="mt-5 space-y-3.5">
                {[["Literature review", 100], ["System design", 70], ["Prototype demo", 20]].map(([name, pct]) => (
                  <div key={name}>
                    <div className="flex justify-between text-[13px] py-1.5">
                      <span>{name}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-[#E6E9E6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#17302A]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-[#FEF3D6] border border-[#F3DFAE] rounded-xl p-4 flex justify-between items-center gap-3">
                <div>
                  <div className="text-[13px] text-[#6B4700]">Suggested supervisor</div>
                  <div className="font-bold">Dr. Imran Shah</div>
                  <div className="text-[13px] text-[#5F6B66]">92% topic match, 2 free slots</div>
                </div>
                <button type="button" className="rounded-[10px] bg-[#17302A] text-white font-bold text-sm px-[18px] py-[11px]">
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS (4 separate boxes in one row) ============ */}
      <section className={`${WRAP} pt-2 pb-12`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((s) => (
            <div
              key={s.big}
              className="bg-white border border-[#E6E6E1] rounded-2xl px-6 py-[22px] shadow-[0_12px_28px_rgba(23,48,42,0.14),0_3px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_56px_rgba(23,48,42,0.28)]"
            >
              <div className="font-['Bricolage_Grotesque'] text-[30px] font-bold">{s.big}</div>
              <div className="text-[13px] text-[#5F6B66]">{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className={`${WRAP} py-[72px]`}>
        <h2 className={H2}>Features</h2>
        <p className="text-[#5F6B66] mb-7">Everything a department needs to run final year projects.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className={`group overflow-hidden bg-white border-[#E6E6E1] ${BASE} ${HEAVY}`}>
              <div className="h-[170px] overflow-hidden">
                <img
                  src={f.img}
                  alt={f.title}
                  loading="lazy"
                  className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="px-[22px] pt-5 pb-6">
                <h3 className="font-['Bricolage_Grotesque'] text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-[#C2410C]">
                  {f.title}
                </h3>
                <p className="text-sm text-[#5F6B66] leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ROLES ============ */}
      <section id="roles" className={`${WRAP} pb-[72px]`}>
        <h2 className={H2}>Roles</h2>
        <p className="text-[#5F6B66] mb-7">Each user sees only what their role allows.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((r) => (
            <div
              key={r.title}
              className={`${BASE} ${HEAVY} p-6 ${
                r.dark ? "bg-[#17302A] border-[#17302A] text-white" : "bg-white border-[#E6E6E1]"
              }`}
            >
              <h3 className="font-['Bricolage_Grotesque'] text-[22px] font-bold mb-2">{r.title}</h3>
              <p className={`text-sm leading-relaxed ${r.dark ? "text-[#C5D4CD]" : "text-[#5F6B66]"}`}>{r.text}</p>
              <ul className="mt-4">
                {r.items.map((item) => (
                  <li key={item} className={r.dark ? "fy-check fy-check-dark" : "fy-check"}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS (full-width band + 4 boxes) ============ */}
      <section id="how-it-works" className="bg-[#17302A] py-[72px]">
        <div id="workflow" />
        <div className={WRAP}>
          <h2 className={`${H2} text-white !mb-5`}>How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`${BASE} bg-white border-[#E6E6E1] text-[#17302A] p-6 hover:shadow-[0_36px_64px_rgba(0,0,0,0.45)]`}
              >
                <div className="w-11 h-11 rounded-full bg-[#EBB44B] text-[#17302A] font-['Bricolage_Grotesque'] text-xl font-extrabold flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <div className="text-lg font-bold">{s.title}</div>
                <p className="mt-1.5 text-sm text-[#5F6B66] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY FYPTRACK ============ */}
      <section className={`${WRAP} py-[72px]`}>
        <h2 className={`${H2} !mb-5`}>Why FYPTrack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className={`${BASE} ${HEAVY} bg-white border-[#E6E6E1] p-6`}>
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold">Without FYPTrack</h3>
            <ul className="mt-4">
              {without.map((i) => (
                <li key={i} className="fy-dash">{i}</li>
              ))}
            </ul>
          </div>
          <div className={`${BASE} ${HEAVY} bg-[#17302A] border-[#17302A] text-white p-6`}>
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold">With FYPTrack</h3>
            <ul className="mt-4">
              {withUs.map((i) => (
                <li key={i} className="fy-check fy-check-dark">{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className={`${WRAP} pb-[72px]`}>
        <h2 className={H2}>FAQ</h2>
        <p className="text-[#5F6B66] mb-6">Quick answers before you start.</p>
        {homeFAQ.map((item, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div key={item.q} className="bg-white border border-[#E6E6E1] rounded-xl px-[22px] py-[18px] mb-3 max-w-[650px]">
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
                className="w-full flex justify-between gap-4 text-left font-bold"
              >
                <span>{item.q}</span>
                <span aria-hidden="true">{isOpen ? "\u2212" : "+"}</span>
              </button>
              {isOpen && <p className="mt-2 text-sm text-[#5F6B66]">{item.a}</p>}
            </div>
          );
        })}
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className={`${WRAP} pb-[72px] grid grid-cols-1 lg:grid-cols-2 gap-5 items-start`}>
        <div>
          <h2 className={H2}>Contact</h2>
          <p className="text-[#5F6B66] mb-6">
            Questions about setting up FYPTrack for your department? Send us a message.
          </p>
          {contactInfo.map((c) => (
            <div key={c.label} className="flex items-center gap-3 mb-4">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#E1EFE8] text-[#17302A] flex items-center justify-center shrink-0">
                <Ico d={c.d} />
              </div>
              <div>
                <div className="font-bold">{c.label}</div>
                <div className="text-[13px] text-[#5F6B66]">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleContactSubmit}
          className="bg-white border border-[#E6E6E1] rounded-2xl p-[26px] shadow-[0_12px_28px_rgba(23,48,42,0.12)]"
        >
          <label htmlFor="c-name" className={`${LABEL} !mt-0`}>Full name</label>
          <input
            id="c-name"
            type="text"
            required
            placeholder="Your name"
            value={contactForm.name}
            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            className={INPUT}
          />
          <label htmlFor="c-email" className={LABEL}>Email</label>
          <input
            id="c-email"
            type="email"
            required
            placeholder="name@university.edu"
            value={contactForm.email}
            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
            className={INPUT}
          />
          <label htmlFor="c-msg" className={LABEL}>Message</label>
          <textarea
            id="c-msg"
            rows={4}
            required
            placeholder="How can we help?"
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            className={INPUT}
          />
          <button
            type="submit"
            className="block w-full mt-[18px] rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-sm px-[18px] py-[11px] transition-colors"
          >
            Send message
          </button>
        </form>
      </section>

      {/* ============ CTA ============ */}
      <section className={WRAP}>
        <div className="bg-[#17302A] text-white text-center rounded-[22px] px-6 py-16 mb-[72px]">
          <h2 className="font-['Bricolage_Grotesque'] text-[28px] sm:text-[42px] font-bold leading-tight mb-2.5">
            Ready to leave the spreadsheets behind?
          </h2>
          <p className="text-[#C5D4CD] mb-6">Set up your department in minutes.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-sm px-[18px] py-[11px] transition-colors"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="rounded-[10px] border border-white/35 hover:bg-white/10 text-white font-bold text-sm px-[18px] py-[11px] transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}