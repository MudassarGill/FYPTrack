import re
from typing import List, Dict, Any

# Department Historical Archives (Past Approved FYPs 2021-2025) for AI Novelty & Similarity Checking
HISTORICAL_ARCHIVES = [
    {
        "id": "ARCH-2024-01",
        "title": "Ethereum-Based Academic Credential Notarization System",
        "year": "2024",
        "lead": "Ahmed Hassan (FA19-BCS-044)",
        "domain": "Cybersecurity",
        "abstract": "Our system deploys smart contracts on Ethereum rollups to store cryptographic hashes of institutional diplomas, enabling automated third-party employer verification via web3 wallets.",
    },
    {
        "id": "ARCH-2023-04",
        "title": "Wheat Yield Forecasting and Mandi Analytics",
        "year": "2023",
        "lead": "Usama Rauf (FA19-BSE-012)",
        "domain": "Machine Learning",
        "abstract": "Predicting Punjab wheat output using seasonal rainfall and district mandi supply logs via gradient boosted regressors and time-series moving averages.",
    },
    {
        "id": "ARCH-2022-09",
        "title": "Fabric Defect Detection on Edge TPU",
        "year": "2022",
        "lead": "Taimoor Shah (FA18-BCE-072)",
        "domain": "Robotics & Embedded",
        "abstract": "Embedded camera utilizing quantized MobileNet SSD running on Coral Edge TPU for real-time fabric warp and weave defect localization in textile mills.",
    },
    {
        "id": "ARCH-2024-11",
        "title": "Hospital EHR Privacy Preservation via Federated Learning",
        "year": "2024",
        "lead": "Khadija Bibi (FA20-BCS-065)",
        "domain": "Healthcare AI",
        "abstract": "Federated aggregation over distributed hospital chest X-ray DICOM databases utilizing differential privacy and secure multi-party computation protocols.",
    },
    {
        "id": "ARCH-2023-15",
        "title": "Autonomous Campus Security Robot with SLAM",
        "year": "2023",
        "lead": "Hamza Shakeel (FA19-BCS-091)",
        "domain": "Robotics",
        "abstract": "ROS 2 navigation stack with 2D LiDAR simultaneous localization and mapping for night surveillance along university perimeter corridors.",
    },
]


def tokenize(text: str) -> set:
    if not text:
        return set()
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    # Stopwords filter
    stopwords = {
        "the", "and", "for", "with", "that", "this", "from", "using", "system",
        "project", "are", "which", "will", "our", "their", "into", "over", "via"
    }
    return {w for w in words if w not in stopwords}


def check_originality(title: str, abstract: str) -> Dict[str, Any]:
    """
    Compares the student proposal against historical departmental archives.
    Returns calculated originality score (0-100), max overlap percentage, and closest match.
    """
    input_text = f"{title} {abstract}"
    input_tokens = tokenize(input_text)
    
    if not input_tokens:
        return {
            "originality_score": 95,
            "max_overlap": 5,
            "closest_match": None,
            "risk_level": "Low Risk",
        }

    max_similarity = 0.0
    closest = None

    for arch in HISTORICAL_ARCHIVES:
        arch_tokens = tokenize(f"{arch['title']} {arch['abstract']}")
        if not arch_tokens:
            continue
        intersection = input_tokens.intersection(arch_tokens)
        union = input_tokens.union(arch_tokens)
        jaccard = len(intersection) / len(union) if union else 0.0

        if jaccard > max_similarity:
            max_similarity = jaccard
            closest = arch

    # Scale jaccard (typical range 0.0 - 0.4) to percentage overlap
    overlap_pct = min(85, int(max_similarity * 180))
    # Minimum realistic originality
    originality = max(15, 100 - overlap_pct)

    risk_level = "Low Risk"
    if overlap_pct >= 25:
        risk_level = "High Risk"
    elif overlap_pct >= 12:
        risk_level = "Moderate"

    return {
        "originality_score": originality,
        "overlap_pct": overlap_pct,
        "closest_match": closest,
        "risk_level": risk_level,
    }
