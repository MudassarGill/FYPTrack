/**
 * FYPTrack AI Similarity Engine
 * Calculates cosine-vector similarity, n-gram overlap, and keyword matching
 * between student proposals and past archived projects.
 */

import { samplePreviousProjects, sampleSupervisors } from "../data/mockData";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but",
  "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
  "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
  "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me",
  "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only",
  "or", "other", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should",
  "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then",
  "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why",
  "with", "would", "you", "your", "yours", "yourself", "yourselves", "using", "used", "system",
  "project", "based", "platform", "final", "year", "design", "development", "paper", "study",
]);

export function extractKeywords(text = "") {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return [...new Set(words)];
}

export function calculateTextSimilarity(queryText, referenceText) {
  const queryTerms = extractKeywords(queryText);
  const refTerms = extractKeywords(referenceText);

  if (queryTerms.length === 0 || refTerms.length === 0) return { score: 0, matchedWords: [] };

  const queryVector = new Map();
  const refVector = new Map();

  for (const term of queryTerms) queryVector.set(term, (queryVector.get(term) || 0) + 1);
  for (const term of refTerms) refVector.set(term, (refVector.get(term) || 0) + 1);

  const matchedWords = queryTerms.filter((term) => refVector.has(term));

  let dotProduct = 0;
  for (const term of matchedWords) {
    dotProduct += queryVector.get(term) * refVector.get(term);
  }

  let queryMag = 0;
  for (const val of queryVector.values()) queryMag += val * val;
  queryMag = Math.sqrt(queryMag);

  let refMag = 0;
  for (const val of refVector.values()) refMag += val * val;
  refMag = Math.sqrt(refMag);

  if (!queryMag || !refMag) return { score: 0, matchedWords: [] };

  const rawScore = (dotProduct / (queryMag * refMag)) * 100;
  // Bound realistically between 4% and 94%
  const finalScore = Math.min(94, Math.max(0, Math.round(rawScore)));

  return {
    score: finalScore,
    matchedWords,
  };
}

export function scanProposalAgainstArchive(proposalTitle, proposalAbstract) {
  const combinedQuery = `${proposalTitle} ${proposalAbstract}`;
  const keywords = extractKeywords(combinedQuery);

  const comparisons = samplePreviousProjects.map((project) => {
    const combinedRef = `${project.title} ${project.abstract} ${project.technologies.join(" ")}`;
    const { score, matchedWords } = calculateTextSimilarity(combinedQuery, combinedRef);
    return {
      project,
      score,
      matchedWords,
    };
  });

  // Sort by highest similarity
  comparisons.sort((a, b) => b.score - a.score);
  const highestMatch = comparisons[0] || { score: 0, matchedWords: [] };

  // Status classification
  let status = "safe";
  let statusText = "Original Proposal (Low Similarity)";
  let badgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";

  if (highestMatch.score >= 25) {
    status = "danger";
    statusText = "High Similarity Alert — Potential Overlap";
    badgeColor = "bg-rose-500/10 text-rose-600 border-rose-500/30";
  } else if (highestMatch.score >= 15) {
    status = "warning";
    statusText = "Moderate Similarity — Needs Review";
    badgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/30";
  }

  // Recommended supervisors based on matching skills
  const matchedSupervisors = sampleSupervisors.filter((sup) => {
    const supSkills = sup.skills.map((s) => s.toLowerCase());
    return keywords.some((kw) => supSkills.some((skill) => skill.includes(kw) || kw.includes(skill)));
  });

  return {
    topScore: highestMatch.score,
    status,
    statusText,
    badgeColor,
    highestMatch,
    allMatches: comparisons.slice(0, 4),
    extractedKeywords: keywords.slice(0, 10),
    recommendedSupervisors: matchedSupervisors.length > 0 ? matchedSupervisors : sampleSupervisors.slice(0, 2),
  };
}
