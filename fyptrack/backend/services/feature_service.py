import math
import re
from typing import Any
from schemas.features import (
    ProjectArchiveItem,
    SimilarityCheckResponse,
    SimilarityMatchDetail,
    SupervisorSkillItem,
)

STOP_WORDS = {
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
}

PROJECTS_DATA: list[dict[str, Any]] = [
    {
        "id": "proj-2024-01",
        "title": "Autonomous Campus Delivery Rover using LiDAR SLAM and Edge AI",
        "field": "Robotics & AI",
        "domain": "Autonomous Systems",
        "year": "2024–25",
        "student_names": ["Hamza Tariq", "Zainab Malik", "Bilal Ahmed"],
        "supervisor": "Dr. Marcus Vance",
        "similarity_score": 6,
        "similarity_status": "safe",
        "similarity_keywords": ["lidar", "slam", "ros2", "path-planning", "obstacle-avoidance"],
        "abstract": "Design and implementation of a four-wheeled indoor/outdoor delivery rover equipped with 2D LiDAR, stereo depth camera, and NVIDIA Jetson Nano.",
        "methodology": "Extended Kalman Filter, Costmap2D, TeB Local Planner, WebSocket telemetry.",
        "technologies": ["ROS2", "Python", "C++", "LiDAR", "NVIDIA Jetson", "OpenCV"],
        "grade": "A+",
        "award": "Best Hardware FYP 2024",
    },
    {
        "id": "proj-2024-02",
        "title": "Federated Learning Framework for Multi-Hospital Brain Tumor Segmentation",
        "field": "Machine Learning · Healthcare",
        "domain": "AI & Healthcare",
        "year": "2024–25",
        "student_names": ["Amina Noor", "Farhan Saeed"],
        "supervisor": "Dr. Sarah Jenkins",
        "similarity_score": 11,
        "similarity_status": "safe",
        "similarity_keywords": ["federated-learning", "brain-tumor", "mri", "privacy", "pytorch"],
        "abstract": "A privacy-preserving collaborative learning protocol allowing clinical centers to jointly train a 3D UNet model on BraTS MRI datasets without pooling raw records.",
        "methodology": "FedAvg algorithm, PySyft, 3D UNet segmentation, Dice coefficient optimization.",
        "technologies": ["PyTorch", "PySyft", "FastAPI", "Docker", "Nibabel"],
        "grade": "A",
        "award": "Outstanding Research Paper",
    },
    {
        "id": "proj-2024-03",
        "title": "Smart Solar Microgrid Energy Monitoring & Fault Prediction via LoRaWAN",
        "field": "IoT · Sustainability",
        "domain": "Smart Energy",
        "year": "2024–25",
        "student_names": ["Usman Ali", "Khadija Bibi", "Saad Rauf"],
        "supervisor": "Prof. Tariq Mahmood",
        "similarity_score": 8,
        "similarity_status": "safe",
        "similarity_keywords": ["lorawan", "solar-inverter", "fault-prediction", "lstm", "iot"],
        "abstract": "An end-to-end telemetry system monitoring 12 rooftop solar inverter arrays on university campus transmitting voltage and irradiance packets over LoRaWAN.",
        "methodology": "LoRaWAN 868MHz protocol, LSTM predictive maintenance, Grafana dashboard.",
        "technologies": ["ESP32", "LoRaWAN", "InfluxDB", "Grafana", "TensorFlow Lite"],
        "grade": "A-",
        "award": "Sustainability Dean's Pick",
    },
    {
        "id": "proj-2024-04",
        "title": "Decentralized University Credential & Transcript Verification on Polygon",
        "field": "Blockchain · Security",
        "domain": "Web3 & Security",
        "year": "2023–24",
        "student_names": ["Mustafa Kamal", "Hassan Raza"],
        "supervisor": "Dr. Elena Rostova",
        "similarity_score": 14,
        "similarity_status": "safe",
        "similarity_keywords": ["polygon", "smart-contracts", "credential-verification", "ipfs", "solidity"],
        "abstract": "Eliminates forged paper degrees through cryptographic soulbound tokens issued to graduating students on Polygon PoS with zero-knowledge proof verification.",
        "methodology": "ERC-5192 Non-Transferable Token, EIP-712 typed data signatures, zk-SNARKs.",
        "technologies": ["Solidity", "Hardhat", "Polygon", "IPFS", "Ethers.js", "React"],
        "grade": "A",
        "award": "FinTech Innovation Prize",
    },
    {
        "id": "proj-2024-05",
        "title": "Real-Time Sign Language to Speech Translation Glove with Flex & IMU Sensors",
        "field": "Assistive Tech · Embedded Systems",
        "domain": "Accessibility Tech",
        "year": "2023–24",
        "student_names": ["Areeba Shahid", "Fatima Zahra"],
        "supervisor": "Dr. Marcus Vance",
        "similarity_score": 19,
        "similarity_status": "review",
        "similarity_keywords": ["sign-language", "flex-sensors", "imu", "ble", "text-to-speech"],
        "abstract": "A smart ergonomic glove capturing finger flex angles and 6-DOF wrist motion to translate American Sign Language (ASL) into synthesized audio.",
        "methodology": "Sensor fusion via Madgwick filter, 1D-CNN gesture classification on-device.",
        "technologies": ["Arduino Nano 33 BLE", "Flex Sensors", "Flutter", "Edge Impulse"],
        "grade": "B+",
        "award": "Community Impact Award",
    },
    {
        "id": "proj-2024-06",
        "title": "Automated Zero-Day Vulnerability Scanning & Patch Recommendation in CI/CD",
        "field": "Cybersecurity · DevOps",
        "domain": "Application Security",
        "year": "2024–25",
        "student_names": ["Danyal Sheikh", "Mohammad Owais"],
        "supervisor": "Prof. Tariq Mahmood",
        "similarity_score": 7,
        "similarity_status": "safe",
        "similarity_keywords": ["vulnerability-scanner", "ci-cd", "static-analysis", "cve", "github-actions"],
        "abstract": "A custom SAST/DAST GitHub Action plugin that parses AST trees for OWASP Top 10 vulnerabilities and uses CodeLlama to generate verified patch pull requests.",
        "methodology": "AST parsing, LLM-guided patch generation, Semgrep rule customization.",
        "technologies": ["Go", "Python", "CodeLlama", "Semgrep", "GitHub Actions", "Docker"],
        "grade": "A+",
        "award": "Cyber Defense Award",
    },
]

SUPERVISORS_DATA: list[dict[str, Any]] = [
    {
        "id": "sup-01",
        "name": "Dr. Sarah Jenkins",
        "title": "Associate Professor & AI Lab Director",
        "department": "Department of Computer Science",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "email": "s.jenkins@university.edu",
        "office": "CS Building, Lab 408",
        "domains": ["Computer Vision", "Medical Imaging", "Deep Learning"],
        "capacity": 5,
        "assigned_count": 4,
        "skills": ["PyTorch", "Computer Vision", "YOLOv9", "Medical Image Segmentation", "Edge AI", "OpenCV"],
        "bio": "Ph.D. from Imperial College London. 12+ years experience mentoring university FYP teams in biomedical imaging and deep learning architectures.",
        "publications_count": 38,
    },
    {
        "id": "sup-02",
        "name": "Prof. Tariq Mahmood",
        "title": "Professor & Cybersecurity Department Chair",
        "department": "Cybersecurity & Information Assurance",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "email": "tariq.mahmood@university.edu",
        "office": "Cyber Center, Room 204",
        "domains": ["Network Security", "Zero-Trust", "Applied Cryptography"],
        "capacity": 6,
        "assigned_count": 5,
        "skills": ["Penetration Testing", "Zero-Trust Architecture", "Cryptographic Protocols", "Threat Modeling", "Wireshark"],
        "bio": "Senior IEEE Member, advisor to National CERT. Focuses on robust intrusion prevention and offensive security testing.",
        "publications_count": 64,
    },
    {
        "id": "sup-03",
        "name": "Dr. Marcus Vance",
        "title": "Associate Professor of Robotics",
        "department": "Mechatronics & Robotics Lab",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "email": "m.vance@university.edu",
        "office": "Robotics Hangar, Bay 2",
        "domains": ["Robotics", "IoT & Embedded", "Autonomous Navigation"],
        "capacity": 4,
        "assigned_count": 3,
        "skills": ["ROS2", "LiDAR SLAM", "Embedded C++", "Sensor Fusion", "FreeRTOS", "Micro-ROS"],
        "bio": "Robotics researcher focusing on field rovers, quadrupeds, assistive rehabilitation exoskeletons, and multi-sensor fusion.",
        "publications_count": 29,
    },
    {
        "id": "sup-04",
        "name": "Dr. Elena Rostova",
        "title": "Senior Lecturer in Cloud & Distributed Systems",
        "department": "Software Engineering & Cloud Systems",
        "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        "email": "elena.rostova@university.edu",
        "office": "CS Building, Lab 312",
        "domains": ["Distributed Systems", "Cloud Computing", "Blockchain"],
        "capacity": 5,
        "assigned_count": 4,
        "skills": ["Kubernetes", "Go (Golang)", "Apache Kafka", "Solidity & EVM", "Distributed Consensus", "Terraform"],
        "bio": "Ex-Google Distributed Infrastructure engineer. Mentors high-throughput cloud backends and resilient event-driven architectures.",
        "publications_count": 22,
    },
]


def extract_keywords(text: str) -> list[str]:
    words = re.findall(r"[a-zA-Z0-9]{3,}", text.lower())
    filtered = [w for w in words if w not in STOP_WORDS]
    return list(dict.fromkeys(filtered))


def compute_text_similarity(text1: str, text2: str) -> tuple[int, list[str]]:
    k1 = extract_keywords(text1)
    k2 = extract_keywords(text2)
    if not k1 or not k2:
        return 0, []

    v1: dict[str, int] = {}
    v2: dict[str, int] = {}
    for w in k1:
        v1[w] = v1.get(w, 0) + 1
    for w in k2:
        v2[w] = v2.get(w, 0) + 1

    common = [w for w in k1 if w in v2]
    dot = sum(v1[w] * v2[w] for w in common)
    mag1 = math.sqrt(sum(c * c for c in v1.values()))
    mag2 = math.sqrt(sum(c * c for c in v2.values()))
    if not mag1 or not mag2:
        return 0, []

    raw = (dot / (mag1 * mag2)) * 100
    score = min(94, max(0, round(raw)))
    return score, common


def get_all_projects(search: str | None = None, domain: str | None = None) -> list[ProjectArchiveItem]:
    results = [ProjectArchiveItem(**item) for item in PROJECTS_DATA]
    if domain and domain != "All":
        results = [p for p in results if p.domain.lower() == domain.lower()]
    if search:
        q = search.lower().strip()
        results = [
            p for p in results
            if q in p.title.lower()
            or q in p.abstract.lower()
            or q in p.supervisor.lower()
            or any(q in s.lower() for s in p.student_names)
            or any(q in t.lower() for t in p.technologies)
        ]
    return results


def check_proposal_similarity(title: str, abstract: str) -> SimilarityCheckResponse:
    query_text = f"{title} {abstract}"
    keywords = extract_keywords(query_text)

    top_score = 0
    top_match: SimilarityMatchDetail | None = None

    for item in PROJECTS_DATA:
        ref_text = f"{item['title']} {item['abstract']} {' '.join(item['technologies'])}"
        score, matched = compute_text_similarity(query_text, ref_text)
        if score > top_score:
            top_score = score
            top_match = SimilarityMatchDetail(
                project_id=item["id"],
                title=item["title"],
                score=score,
                matched_words=matched[:6],
            )

    if top_score >= 25:
        status = "danger"
        status_text = "High Similarity Alert — Potential Overlap"
    elif top_score >= 15:
        status = "warning"
        status_text = "Moderate Similarity — Needs Review"
    else:
        status = "safe"
        status_text = "Original Proposal (Low Similarity)"

    recommended = [
        s["name"] for s in SUPERVISORS_DATA
        if any(kw in " ".join(s["skills"]).lower() for kw in keywords)
    ]
    if not recommended:
        recommended = [SUPERVISORS_DATA[0]["name"]]

    return SimilarityCheckResponse(
        top_score=top_score,
        status=status,
        status_text=status_text,
        extracted_keywords=keywords[:8],
        highest_match=top_match,
        recommended_supervisors=recommended[:3],
    )


def get_all_supervisors(skill: str | None = None) -> list[SupervisorSkillItem]:
    results = [SupervisorSkillItem(**item) for item in SUPERVISORS_DATA]
    if skill and skill != "All":
        results = [
            s for s in results
            if any(skill.lower() == sk.lower() for sk in s.skills)
        ]
    return results
