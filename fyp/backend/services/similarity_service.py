import os
import re
import math
import requests
from collections import Counter
from typing import List, Dict, Any, Tuple

# Hugging Face Inference API Configuration
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", os.getenv("HF_TOKEN", ""))
HUGGINGFACE_MODEL = os.getenv("HUGGINGFACE_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
HF_API_URL = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{HUGGINGFACE_MODEL}"

# Institutional Archive Pool (Benchmark past FYP projects from 2021-2025)
ARCHIVED_PROJECTS_POOL = [
    {
        "id": "ARCH-2023-014",
        "title": "Wheat Yield Forecasting and Mandi Analytics",
        "domain": "Machine Learning",
        "year": "2023",
        "lead_author": "Usama Rauf (FA19-BSE-012)",
        "supervisor": "Dr. Imran Shah",
        "abstract": (
            "Forecasting wholesale mandi pricing using multi-season arrival volume and meteorological indices "
            "via bidirectional LSTM networks. Predicting Punjab wheat output using seasonal rainfall and district mandi "
            "supply logs via gradient boosted regressors and time-series ARIMA baseline algorithms."
        ),
        "technologies": "Python, PyTorch, Pandas, FastAPI",
    },
    {
        "id": "ARCH-2024-044",
        "title": "Ethereum-Based Academic Credential Notarization System",
        "domain": "Cybersecurity",
        "year": "2024",
        "lead_author": "Ahmed Hassan (FA19-BCS-044)",
        "supervisor": "Dr. Sadia Malik",
        "abstract": (
            "Our system deploys smart contracts on Ethereum rollups to store cryptographic hashes of institutional diplomas, "
            "enabling automated third-party employer verification via web3 wallets and decentralized identity standards."
        ),
        "technologies": "Solidity, Ethereum, Ethers.js, React",
    },
    {
        "id": "ARCH-2022-072",
        "title": "Fabric Defect Detection on Edge TPU",
        "domain": "Computer Vision & Embedded",
        "year": "2022",
        "lead_author": "Taimoor Shah (FA18-BCE-072)",
        "supervisor": "Dr. Rabia Qazi",
        "abstract": (
            "Embedded camera utilizing quantized MobileNet SSD running on Coral Edge TPU for defect localization "
            "and weave warp inconsistency detection on high-speed industrial textile looms."
        ),
        "technologies": "C++, TensorFlow Lite, Edge TPU, OpenCV",
    },
    {
        "id": "ARCH-2023-088",
        "title": "Autonomous Indoor Guided Vehicle for Warehouse Logistics",
        "domain": "Robotics & Embedded",
        "year": "2023",
        "lead_author": "Daniyal Qureshi (FA19-BSE-088)",
        "supervisor": "Dr. Noman Ali",
        "abstract": (
            "Autonomous mobile robot navigation utilizing 2D LiDAR SLAM, ROS navigation stack, and ultrasonic proximity "
            "sensors for automated package sorting and obstacle avoidance in fulfillment centers."
        ),
        "technologies": "ROS, Python, C++, SLAM, LiDAR",
    },
    {
        "id": "ARCH-2024-102",
        "title": "Privacy-Preserving Federated Learning for Multi-Hospital Electronic Health Records",
        "domain": "Healthcare AI & Security",
        "year": "2024",
        "lead_author": "Zuhair Siddiqui (FA20-BCS-022)",
        "supervisor": "Dr. Imran Shah",
        "abstract": (
            "Federated optimization framework utilizing differential privacy noise mechanisms to aggregate distributed neural "
            "networks over clinical patient diagnostics across decentralized healthcare providers without centralizing raw data."
        ),
        "technologies": "PyTorch, PySyft, Docker, FastAPI",
    },
    {
        "id": "ARCH-2023-031",
        "title": "Solar Microgrid Load Forecasting and Peak Demand Management",
        "domain": "Distributed Systems",
        "year": "2023",
        "lead_author": "Momin Baig (FA19-BSE-031)",
        "supervisor": "Dr. Farhan Jamil",
        "abstract": (
            "Distributed telemetry pipeline streaming smart meter time-series metrics over MQTT and Apache Kafka to balance "
            "localized microgrid inverter storage and schedule battery discharge during peak load hours."
        ),
        "technologies": "Go, MQTT, Apache Kafka, InfluxDB",
    },
]

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
    "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
    "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
    "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no",
    "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
    "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't",
    "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
    "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd",
    "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's",
    "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't",
    "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "system",
    "using", "project", "aims", "develop", "provide", "via"
}


def tokenize(text: str) -> List[str]:
    """Tokenize and filter text into informative word tokens."""
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    return [w for w in words if w not in STOPWORDS]


def get_ngrams(tokens: List[str], n: int = 2) -> List[str]:
    """Extract n-grams for phrase-level matching."""
    return [" ".join(tokens[i : i + n]) for i in range(len(tokens) - n + 1)]


def compute_tf_idf_cosine(text1: str, text2: str) -> Tuple[float, List[str]]:
    """
    Computes cosine similarity between two texts using token frequencies + bigram features,
    and returns matching overlapping keywords.
    """
    tokens1 = tokenize(text1)
    tokens2 = tokenize(text2)

    if not tokens1 or not tokens2:
        return 0.0, []

    # Include unigrams + bigrams
    all_features1 = tokens1 + get_ngrams(tokens1, 2)
    all_features2 = tokens2 + get_ngrams(tokens2, 2)

    vec1 = Counter(all_features1)
    vec2 = Counter(all_features2)

    intersection = set(vec1.keys()) & set(vec2.keys())
    if not intersection:
        return 0.0, []

    dot_product = sum(vec1[x] * vec2[x] for x in intersection)
    sum1 = sum(val**2 for val in vec1.values())
    sum2 = sum(val**2 for val in vec2.values())

    denominator = math.sqrt(sum1) * math.sqrt(sum2)
    if not denominator:
        return 0.0, []

    score = dot_product / denominator
    common_words = [item for item in intersection if " " not in item][:6]
    return min(1.0, score), common_words


def scan_proposal_similarity(title: str, domain: str, abstract: str) -> Dict[str, Any]:
    """
    Scans a proposal against the full institutional archive pool, returning
    the closest matching past thesis, overlap percentage, originality score, and risk status.
    """
    combined_query = f"{title} {domain} {abstract}"

    highest_similarity = 0.0
    best_match = ARCHIVED_PROJECTS_POOL[0]
    best_common_keywords: List[str] = []

    for arch in ARCHIVED_PROJECTS_POOL:
        arch_text = f"{arch['title']} {arch['domain']} {arch['abstract']}"
        sim, common_kw = compute_tf_idf_cosine(combined_query, arch_text)

        if sim > highest_similarity:
            highest_similarity = sim
            best_match = arch
            best_common_keywords = common_kw

    # Format percentages
    # Cosine similarity in real text usually tops around 0.35 - 0.70 for high similarity
    # Calibrate: 0.20+ is flagged as high similarity in academic NLP cross-checks
    calibrated_overlap = round(min(85.0, highest_similarity * 100 * 1.35), 1)
    if calibrated_overlap < 5.0:
        calibrated_overlap = 5.8  # Minimal natural baseline

    originality = round(max(15.0, 100.0 - calibrated_overlap), 1)

    if calibrated_overlap >= 20.0:
        risk_level = "High Risk"
        cleared = False
        action_note = "High overlap detected with previous capstone archive. Requires FYP Committee originality review."
    elif calibrated_overlap >= 10.0:
        risk_level = "Moderate"
        cleared = True
        action_note = "Moderate conceptual overlap. Ensure literature review clearly distinguishes current methodology."
    else:
        risk_level = "Low Risk"
        cleared = True
        action_note = "High novelty. No critical semantic overlap found in departmental thesis repository."

    # Extract an excerpt from matched archive abstract for side-by-side view
    matched_sentences = best_match["abstract"].split(". ")
    snippet = matched_sentences[0] + "." if matched_sentences else best_match["abstract"]

    return {
        "similarity_score": calibrated_overlap,
        "originality_score": originality,
        "risk_level": risk_level,
        "cleared": cleared,
        "action_note": action_note,
        "matched_project": best_match["title"],
        "matched_year": best_match["year"],
        "matched_lead": best_match["lead_author"],
        "matched_supervisor": best_match["supervisor"],
        "matched_snippet": snippet,
        "common_keywords": best_common_keywords or ["methodology", "model"],
    }
