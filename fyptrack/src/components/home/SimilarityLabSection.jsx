import { useState } from "react";
import { scanProposalAgainstArchive } from "../../utils/similarity";

export default function SimilarityLabSection() {
  const [title, setTitle] = useState("Federated Edge Diagnostics for Cardiac Arrhythmia Detection");
  const [abstract, setAbstract] = useState(
    "A distributed mobile health monitoring system deploying quantized convolutional neural networks onto wearable ECG microcontrollers. Uses federated averaging across patient devices to update cardiac classification models without uploading sensitive physiological signals to the cloud."
  );
  const [results, setResults] = useState(() =>
    scanProposalAgainstArchive(
      "Federated Edge Diagnostics for Cardiac Arrhythmia Detection",
      "A distributed mobile health monitoring system deploying quantized convolutional neural networks onto wearable ECG microcontrollers. Uses federated averaging across patient devices to update cardiac classification models without uploading sensitive physiological signals to the cloud."
    )
  );

  const sampleIdeas = [
    {
      title: "Decentralized Micro-Credentialing on Blockchain with Zero-Knowledge Proofs",
      abstract: "Issuing cryptographic academic credentials via smart contracts on Polygon, using zk-SNARKs for student privacy verification by employers.",
    },
    {
      title: "Autonomous Quadcopter LiDAR Navigation for Indoor Search and Rescue",
      abstract: "Using ROS2, 2D LiDAR SLAM, and optical flow cameras for real-time obstacle avoidance and path planning in GPS-denied collapsed buildings.",
    },
    {
      title: "Smart Hydroponics Farm Automation with LoRaWAN and Crop Health AI",
      abstract: "Monitoring nutrient levels, pH, and water temperature using ESP32 IoT nodes, with a lightweight YOLO model detecting fungal growth.",
    },
  ];

  function handleScan(e) {
    e.preventDefault();
    const scanData = scanProposalAgainstArchive(title, abstract);
    setResults(scanData);
  }

  function handleLoadSample(sample) {
    setTitle(sample.title);
    setAbstract(sample.abstract);
    const scanData = scanProposalAgainstArchive(sample.title, sample.abstract);
    setResults(scanData);
  }

  return (
    <section id="similarity-lab" className="relative bg-[#17302B] py-20 text-white">
      {/* Background radial gradient */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#E9B44C]/5 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E9B44C]/40 bg-[#E9B44C]/10 px-4 py-1 text-xs font-semibold text-[#E9B44C]">
            Interactive AI Lab
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Live FYP Proposal Similarity Radar
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Before submitting your FYP proposal to the coordinator, test your concept against the past 5+ years of approved university projects in real-time.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Try a sample proposal:</span>
          {sampleIdeas.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(s)}
              className="cursor-pointer rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-emerald-200 transition hover:bg-[#E9B44C] hover:text-[#17302B] hover:border-[#E9B44C]"
            >
              Demo {idx + 1}: {s.title.split(" ")[0]}...
            </button>
          ))}
        </div>

        {/* Main Grid: Form on Left, Radar Results on Right */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Input Form */}
          <div className="lg:col-span-6 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="h-5 w-5 text-[#E9B44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Enter Proposed FYP Idea
            </h3>

            <form onSubmit={handleScan} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smart Campus Energy Scheduler..."
                  required
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition focus:border-[#E9B44C] focus:bg-white/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Proposal Abstract / Problem Statement
                </label>
                <textarea
                  rows={5}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Describe your system architecture, technologies, and target novelty..."
                  required
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition focus:border-[#E9B44C] focus:bg-white/15"
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#E9B44C] to-[#f5c76c] py-3 text-xs font-bold text-[#17302B] shadow-lg shadow-[#E9B44C]/25 transition hover:brightness-105 active:scale-98"
              >
                Scan Archive for Similarity →
              </button>
            </form>
          </div>

          {/* Radar Diagnosis & Results */}
          <div className="lg:col-span-6 rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  AI Similarity Diagnosis
                </span>
                <span className="text-[11px] font-mono text-[#E9B44C]">
                  Cosine Similarity Engine
                </span>
              </div>

              {/* Main Score Display */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Archive Similarity Index</div>
                    <div className="mt-1 text-4xl font-extrabold text-[#E9B44C]">
                      {results.topScore}%
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${results.badgeColor}`}>
                      {results.statusText}
                    </span>
                    <div className="mt-1 text-[10px] text-slate-400">
                      University Threshold: 15% Maximum
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      results.topScore < 15
                        ? "bg-emerald-400"
                        : results.topScore < 25
                        ? "bg-amber-400"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.max(4, results.topScore)}%` }}
                  />
                </div>
              </div>

              {/* Matched Keywords */}
              <div className="mt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Extracted Novelty Keywords:
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {results.extractedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-mono text-emerald-300 border border-white/5"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Highest Matching Project from Archive */}
              {results.highestMatch?.project && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Closest Archived Match ({results.highestMatch.score}% overlap)</span>
                    <span className="text-[#E9B44C]">{results.highestMatch.project.year}</span>
                  </div>
                  <p className="mt-1 font-semibold text-white">
                    {results.highestMatch.project.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                    {results.highestMatch.project.abstract}
                  </p>
                </div>
              )}
            </div>

            {/* Recommended Faculty Supervisor */}
            <div className="mt-5 border-t border-white/10 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E9B44C] block">
                Recommended Supervisor Based on Domain:
              </span>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-white/5 p-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={results.recommendedSupervisors[0]?.avatar}
                    alt={results.recommendedSupervisors[0]?.name}
                    className="h-9 w-9 rounded-full object-cover border border-[#E9B44C]"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {results.recommendedSupervisors[0]?.name}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      {results.recommendedSupervisors[0]?.title}
                    </div>
                  </div>
                </div>
                <a
                  href="#supervisors"
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-white/20 transition"
                >
                  View Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
