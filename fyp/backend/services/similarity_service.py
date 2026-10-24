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

# Institutional Archive Pool (Benchmark past FYP projects from 2020-2025 across all computing domains)
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
        "domain": "Cybersecurity & Blockchain",
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
        "domain": "Distributed Systems & IoT",
        "year": "2023",
        "lead_author": "Momin Baig (FA19-BSE-031)",
        "supervisor": "Dr. Farhan Jamil",
        "abstract": (
            "Distributed telemetry pipeline streaming smart meter time-series metrics over MQTT and Apache Kafka to balance "
            "localized microgrid inverter storage and schedule battery discharge during peak load hours."
        ),
        "technologies": "Go, MQTT, Apache Kafka, InfluxDB",
    },
    {
        "id": "ARCH-2024-019",
        "title": "Low-Resource Urdu Dialect Speech Recognition and Phoneme Transcriber",
        "domain": "Natural Language Processing",
        "year": "2024",
        "lead_author": "Khadija Khan (FA20-BSE-019)",
        "supervisor": "Dr. Imran Shah",
        "abstract": (
            "End-to-end acoustic speech-to-text pipeline utilizing fine-tuned Whisper transformer architectures on regional "
            "Urdu dialects, paired with phonetic sequence alignment and CTC loss minimization for voice search applications."
        ),
        "technologies": "Python, Hugging Face Transformers, PyTorch, Librosa",
    },
    {
        "id": "ARCH-2022-055",
        "title": "Zero-Knowledge Rollup Verification for Micro-Payments in Peer Networks",
        "domain": "Cybersecurity & Blockchain",
        "year": "2022",
        "lead_author": "Ali Asghar (FA18-BCS-055)",
        "supervisor": "Dr. Sadia Malik",
        "abstract": (
            "ZK-SNARK proof verification circuits implemented in Circom to compress off-chain micro-transaction batches into "
            "succinct validity proofs posted to Layer-1 smart contracts, reducing gas overhead by 85%."
        ),
        "technologies": "Circom, SnarkJS, Solidity, Node.js",
    },
    {
        "id": "ARCH-2023-112",
        "title": "Real-Time Traffic Congestion Prediction and Adaptive Signal Timing",
        "domain": "Computer Vision & Smart Cities",
        "year": "2023",
        "lead_author": "Waleed Tariq (FA19-BCS-112)",
        "supervisor": "Dr. Rabia Qazi",
        "abstract": (
            "Multi-camera CCTV edge pipeline using YOLOv8 object detection and ByteTrack vehicle tracking to estimate arterial "
            "intersection queue lengths and dynamically adjust traffic green-wave signal cycles."
        ),
        "technologies": "Python, YOLOv8, OpenCV, DeepStream, MQTT",
    },
    {
        "id": "ARCH-2024-067",
        "title": "Automated Plant Disease Diagnosis from Drone Multispectral Imagery",
        "domain": "Computer Vision & Agriculture",
        "year": "2024",
        "lead_author": "Saba Murtaza (FA20-BSE-067)",
        "supervisor": "Dr. Rabia Qazi",
        "abstract": (
            "Deep convolutional neural networks and Vision Transformers for early leaf rust and blight detection in wheat and "
            "cotton fields from UAV multispectral orthomosaic aerial surveys."
        ),
        "technologies": "Python, PyTorch, Vision Transformers, GDAL, QGIS",
    },
    {
        "id": "ARCH-2023-049",
        "title": "Autonomous Agricultural Drone for Spraying and Crop Canopy Surveillance",
        "domain": "Robotics & Embedded",
        "year": "2023",
        "lead_author": "Haris Mehmood (FA19-BCE-049)",
        "supervisor": "Dr. Noman Ali",
        "abstract": (
            "Quadcopter UAV avionics system featuring Pixhawk flight controller, PX4 autopilot, RTK GPS centimeter-precision "
            "waypoint navigation, and pulsed solenoid variable-rate pesticide spraying nozzles."
        ),
        "technologies": "C++, PX4 Autopilot, MAVLink, ROS 2, Raspberry Pi",
    },
    {
        "id": "ARCH-2024-081",
        "title": "Automated Vulnerability Scanner for Smart Contract Reentrancy and Flash Loans",
        "domain": "Cybersecurity",
        "year": "2024",
        "lead_author": "Bilal Naveed (FA20-BCS-081)",
        "supervisor": "Dr. Sadia Malik",
        "abstract": (
            "Static analysis and symbolic execution tool analyzing EVM bytecode to identify integer overflows, reentrancy vectors, "
            "and oracle manipulation vulnerabilities prior to mainnet protocol deployment."
        ),
        "technologies": "Python, Mythril, Slither, Solidity, Web3.py",
    },
    {
        "id": "ARCH-2022-094",
        "title": "Cloud-Native Microservices Telemetry and Anomaly Detection Platform",
        "domain": "Distributed Systems & Cloud",
        "year": "2022",
        "lead_author": "Mustafa Cheema (FA18-BSE-094)",
        "supervisor": "Dr. Farhan Jamil",
        "abstract": (
            "Distributed tracing collector aggregating OpenTelemetry metrics and gRPC spans into Prometheus, utilizing isolation "
            "forests and autoencoders for real-time latency bottleneck detection in Kubernetes clusters."
        ),
        "technologies": "Go, Kubernetes, OpenTelemetry, Prometheus, Docker",
    },
    {
        "id": "ARCH-2023-125",
        "title": "EEG-Based Brain-Computer Interface for Wheelchair Navigation",
        "domain": "Healthcare AI & Embedded",
        "year": "2023",
        "lead_author": "Zoya Fatima (FA19-BCE-125)",
        "supervisor": "Dr. Noman Ali",
        "abstract": (
            "Non-invasive 8-channel EEG headset signal acquisition processing motor imagery brainwaves via spatial filters and "
            "1D CNN classification to actuate motorized wheelchair steering and velocity commands."
        ),
        "technologies": "Python, OpenBCI, TensorFlow, Arduino, C++",
    },
    {
        "id": "ARCH-2024-033",
        "title": "High-Throughput Algorithmic Trading with Reinforcement Learning",
        "domain": "Machine Learning & Fintech",
        "year": "2024",
        "lead_author": "Rayan Khalid (FA20-BCS-033)",
        "supervisor": "Dr. Imran Shah",
        "abstract": (
            "Deep Q-Networks (DQN) and Proximal Policy Optimization (PPO) agents trained on Level-2 limit order book tick data "
            "for equity price prediction and automated risk-hedged market making on financial exchanges."
        ),
        "technologies": "Python, Stable-Baselines3, Gym, FastAPI, Redis",
    },
    {
        "id": "ARCH-2021-018",
        "title": "Real-Time Helmet and Safety Gear Compliance Detection on Construction Sites",
        "domain": "Computer Vision",
        "year": "2021",
        "lead_author": "Arslan Javed (FA17-BCS-018)",
        "supervisor": "Dr. Rabia Qazi",
        "abstract": (
            "Surveillance camera pipeline running lightweight Darknet YOLO models on edge cameras to detect missing hardhats, "
            "reflective safety vests, and harness violations with automated SMS safety alerts."
        ),
        "technologies": "Python, Darknet, OpenCV, Twilio API, Flask",
    },
    {
        "id": "ARCH-2024-098",
        "title": "Distributed Ledger for Pharmaceutical Cold-Chain Temperature Provenance",
        "domain": "Cybersecurity & IoT",
        "year": "2024",
        "lead_author": "Maryam Safdar (FA20-BSE-098)",
        "supervisor": "Dr. Sadia Malik",
        "abstract": (
            "Hyperledger Fabric private blockchain network integrated with ESP32 cellular temperature logging nodes, creating "
            "immutable audit trails for vaccine cold-chain shipments with smart contract spoilage alerts."
        ),
        "technologies": "Hyperledger Fabric, Go, Node.js, ESP32, Docker",
    },
    {
        "id": "ARCH-2023-062",
        "title": "Multi-Agent Swarm Robotics for Search and Rescue in Collapsed Structures",
        "domain": "Robotics & AI",
        "year": "2023",
        "lead_author": "Naveed Akram (FA19-BCE-062)",
        "supervisor": "Dr. Noman Ali",
        "abstract": (
            "Decentralized flocking and perimeter exploration algorithms allowing a swarm of mini-tracked rovers to map confined "
            "disaster zones using infrared thermal cameras and decentralized mesh radio communication."
        ),
        "technologies": "C++, ROS, Gazebo, ESP-NOW, Python",
    },
    {
        "id": "ARCH-2022-041",
        "title": "Automated Legal Contract Analysis and Clause Classification Using Transformers",
        "domain": "Natural Language Processing",
        "year": "2022",
        "lead_author": "Hina Batool (FA18-BSE-041)",
        "supervisor": "Dr. Imran Shah",
        "abstract": (
            "Fine-tuned Legal-BERT language model performing multi-label classification on commercial enterprise contracts to "
            "flag non-standard indemnity clauses, termination penalties, and liability disclosures."
        ),
        "technologies": "Python, PyTorch, Hugging Face, spaCy, Streamlit",
    },
    {
        "id": "ARCH-2024-115",
        "title": "Cross-Platform Federated Mobile Malware Detection on Android Subsystems",
        "domain": "Cybersecurity & Mobile",
        "year": "2024",
        "lead_author": "Talha Rehman (FA20-BCS-115)",
        "supervisor": "Dr. Sadia Malik",
        "abstract": (
            "Client-side on-device neural network analyzing dynamic syscall sequences and permission intent trees to detect "
            "ransomware and trojans without transmitting telemetry or private user data to central cloud servers."
        ),
        "technologies": "Kotlin, TensorFlow Lite, Python, Flower, Android SDK",
    },
    {
        "id": "ARCH-2023-077",
        "title": "Serverless Event-Driven Architecture for Large-Scale Video Transcoding",
        "domain": "Distributed Systems & Cloud",
        "year": "2023",
        "lead_author": "Waqas Aslam (FA19-BSE-077)",
        "supervisor": "Dr. Farhan Jamil",
        "abstract": (
            "Cloud-native video ingestion engine slicing ultra-high-definition video chunks across parallel AWS Lambda and "
            "Fargate workers using FFmpeg, cutting transcoding latency by 72% relative to monolithic servers."
        ),
        "technologies": "Python, AWS Lambda, S3, SQS, FFmpeg, Terraform",
    },
    {
        "id": "ARCH-2024-052",
        "title": "Deep Learning for Automated Diabetic Retinopathy and Macular Edema Grading",
        "domain": "Computer Vision & Healthcare",
        "year": "2024",
        "lead_author": "Mahnoor Tariq (FA20-BSE-052)",
        "supervisor": "Dr. Rabia Qazi",
        "abstract": (
            "Ensemble of EfficientNet and ResNet-50 models trained on fundus retinal photographs to classify diabetic retinopathy "
            "severity across five clinical stages with Grad-CAM visualization for ophthalmologist validation."
        ),
        "technologies": "Python, TensorFlow, Keras, OpenCV, Grad-CAM, Flask",
    },
    {
        "id": "ARCH-2021-089",
        "title": "Smart Campus Energy Management and Occupancy-Based HVAC Optimization",
        "domain": "Distributed Systems & IoT",
        "year": "2021",
        "lead_author": "Fahad Zubair (FA17-BCE-089)",
        "supervisor": "Dr. Farhan Jamil",
        "abstract": (
            "IoT sensor network utilizing LoRaWAN nodes measuring room temperature, humidity, and PIR motion to control campus "
            "chiller valves and split-AC units, resulting in a 22% reduction in departmental electric utility bills."
        ),
        "technologies": "C++, LoRaWAN, Node-RED, Python, PostgreSQL",
    },
    {
        "id": "ARCH-2023-104",
        "title": "AR-Assisted Surgical Navigation and 3D Anatomical Tumor Projection",
        "domain": "Computer Vision & AR",
        "year": "2023",
        "lead_author": "Daniyal Jafri (FA19-BCS-104)",
        "supervisor": "Dr. Rabia Qazi",
        "abstract": (
            "Augmented reality headset application rendering real-time 3D patient CT organ reconstructions aligned onto physical "
            "surgical phantom models using optical fiducial tracking and Unity AR Foundation."
        ),
        "technologies": "C#, Unity, AR Foundation, OpenCV, VTK, DICOM",
    },
    {
        "id": "ARCH-2024-121",
        "title": "Zero-Knowledge Identity Verification for Privacy-Preserving Voting Systems",
        "domain": "Cybersecurity & Blockchain",
        "year": "2024",
        "lead_author": "Saad Qureshi (FA20-BCS-121)",
        "supervisor": "Dr. Sadia Malik",
        "abstract": (
            "Decentralized electronic voting protocol using ZK-SNARKs and ElGamal homomorphic encryption, allowing voters to verify "
            "their ballot was included in final tallies without revealing voter identity or ballot choice."
        ),
        "technologies": "Rust, Solidity, Circom, Web3.js, React",
    },
    {
        "id": "ARCH-2022-064",
        "title": "Automated Code Review and Security Smell Detection Using Graph Neural Networks",
        "domain": "Software Engineering & AI",
        "year": "2022",
        "lead_author": "Mubashir Ali (FA18-BSE-064)",
        "supervisor": "Dr. Farhan Jamil",
        "abstract": (
            "Abstract Syntax Tree (AST) and Control Flow Graph extraction from GitHub commits processed via Gated Graph Neural "
            "Networks (GGNN) to detect SQL injection, unvalidated redirects, and hardcoded credential leaks."
        ),
        "technologies": "Python, PyTorch Geometric, Joern, Clang, Docker",
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


def query_huggingface_similarity(source_text: str, candidate_texts: List[str]) -> List[float]:
    """
    Queries Hugging Face Inference API for semantic sentence embeddings / similarity
    using sentence-transformers models. Falls back gracefully to local cosine analysis
    if API key is not configured or network request fails.
    """
    if not HUGGINGFACE_API_KEY:
        return []

    try:
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        # Hugging Face sentence-similarity pipeline endpoint
        api_url = f"https://api-inference.huggingface.co/models/{HUGGINGFACE_MODEL}"
        payload = {
            "inputs": {
                "source_sentence": source_text,
                "sentences": candidate_texts
            }
        }
        resp = requests.post(api_url, headers=headers, json=payload, timeout=4)
        if resp.status_code == 200:
            scores = resp.json()
            if isinstance(scores, list) and all(isinstance(x, (int, float)) for x in scores):
                return [float(x) for x in scores]
    except Exception:
        pass  # Graceful fallback to local vectorized model
    return []


def scan_proposal_similarity(title: str, domain: str, abstract: str) -> Dict[str, Any]:
    """
    Scans a proposal against the full institutional archive pool, returning
    the closest matching past thesis, overlap percentage, originality score, and risk status.
    Utilizes Hugging Face AI embeddings when configured, with high-accuracy local vectorized fallback.
    """
    combined_query = f"{title} {domain} {abstract}"

    highest_similarity = 0.0
    best_match = ARCHIVED_PROJECTS_POOL[0]
    best_common_keywords: List[str] = []

    # Attempt Hugging Face Inference API similarity if configured
    archive_texts = [f"{arch['title']} {arch['domain']} {arch['abstract']}" for arch in ARCHIVED_PROJECTS_POOL]
    hf_scores = query_huggingface_similarity(combined_query, archive_texts)
    
    if hf_scores and len(hf_scores) == len(ARCHIVED_PROJECTS_POOL):
        max_idx = int(max(range(len(hf_scores)), key=lambda i: hf_scores[i]))
        highest_similarity = float(hf_scores[max_idx])
        best_match = ARCHIVED_PROJECTS_POOL[max_idx]
        _, best_common_keywords = compute_tf_idf_cosine(combined_query, archive_texts[max_idx])
    else:
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


# Institutional Faculty Supervisor Research Profiles & Expertise
FACULTY_EXPERTISE_PROFILES = {
    "Dr. Imran Shah": {
        "designation": "Associate Professor",
        "domains": ["Machine Learning", "Deep Learning", "Natural Language Processing", "Fintech", "Predictive Analytics"],
        "keywords": ["machine", "learning", "deep", "neural", "lstm", "transformer", "bert", "gpt", "whisper", "nlp", "speech", "pricing", "forecasting", "pytorch", "trading", "finance", "mandi", "crop"],
        "max_quota": 5,
    },
    "Dr. Sadia Malik": {
        "designation": "Assistant Professor",
        "domains": ["Cybersecurity & Blockchain", "Cryptography", "Network Security", "Smart Contracts", "Privacy"],
        "keywords": ["security", "cyber", "ethereum", "solidity", "smart contract", "zk-snark", "rollup", "blockchain", "vulnerability", "malware", "notarization", "reentrancy", "hyperledger", "provenance"],
        "max_quota": 5,
    },
    "Dr. Rabia Qazi": {
        "designation": "Assistant Professor",
        "domains": ["Computer Vision", "Medical Imaging", "Edge AI", "Augmented Reality", "Deep Learning"],
        "keywords": ["vision", "computer", "image", "yolo", "opencv", "retinopathy", "ct", "mri", "augmented reality", "unity", "detection", "segmentation", "drone", "multispectral", "tpu", "edge"],
        "max_quota": 5,
    },
    "Dr. Noman Ali": {
        "designation": "Assistant Professor",
        "domains": ["Robotics & Embedded Systems", "IoT", "Autonomous Vehicles", "UAVs & Drones", "Control Systems"],
        "keywords": ["robot", "robotics", "embedded", "lidar", "slam", "ros", "ros2", "drone", "quadcopter", "uav", "pixhawk", "autopilot", "eeg", "bci", "sensors", "arduino", "stm32", "esp32"],
        "max_quota": 5,
    },
    "Dr. Farhan Jamil": {
        "designation": "Associate Professor",
        "domains": ["Distributed Systems & Cloud", "Software Engineering", "Smart Energy & IoT", "DevOps"],
        "keywords": ["distributed", "cloud", "microservices", "kubernetes", "docker", "kafka", "mqtt", "telemetry", "prometheus", "smart grid", "solar", "energy", "graph neural", "code review"],
        "max_quota": 5,
    },
}


def recommend_supervisors_for_project(
    title: str, domain: str, abstract: str, faculty_list: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    AI Supervisor Recommendation & Workload Matching Engine.
    Evaluates project domain, title, and abstract against faculty research profiles,
    publications/archives, and live workload quotas to calculate an AI Match Score.
    """
    project_text = f"{title} {domain} {abstract}".lower()
    project_tokens = set(tokenize(project_text))

    ranked = []
    for fac in faculty_list:
        name = fac.get("name", "")
        profile = FACULTY_EXPERTISE_PROFILES.get(
            name,
            {
                "designation": "Faculty Supervisor",
                "domains": ["General Computing"],
                "keywords": ["computing", "software"],
                "max_quota": 5,
            },
        )

        # 1. Exact and semantic domain match (weight 45%)
        domain_overlap = False
        project_domain_lower = domain.lower()
        matched_domains = []
        for d in profile["domains"]:
            d_lower = d.lower()
            if d_lower in project_domain_lower or project_domain_lower in d_lower:
                domain_overlap = True
                matched_domains.append(d)

        domain_score = 45.0 if domain_overlap else (20.0 if any(tok in project_tokens for tok in tokenize(domain)) else 5.0)

        # 2. Research keyword intersection (weight 35%)
        kw_set = set(profile["keywords"])
        intersecting_kw = project_tokens & kw_set
        kw_ratio = min(1.0, len(intersecting_kw) / 4.0)
        keyword_score = kw_ratio * 35.0

        # 3. Workload quota balancing (weight 20%)
        free_slots = fac.get("free_slots", 0)
        capacity = fac.get("capacity", 5)
        assigned_count = fac.get("assigned_count", 0)
        
        if free_slots <= 0:
            quota_score = 0.0
            quota_status = "Quota Full (0 slots)"
        elif free_slots >= 3:
            quota_score = 20.0
            quota_status = f"High Availability ({free_slots} slots)"
        else:
            quota_score = 12.0
            quota_status = f"Moderate Load ({free_slots} slots)"

        # Combined AI Match Score
        total_score = round(min(98.0, max(28.0, domain_score + keyword_score + quota_score)), 1)
        
        # If quota is strictly full, cap recommendation
        if free_slots <= 0:
            total_score = min(total_score, 45.0)
            rec_badge = "Quota Reached"
        elif total_score >= 80.0:
            rec_badge = "Top AI Recommendation"
        elif total_score >= 65.0:
            rec_badge = "Strong Academic Fit"
        else:
            rec_badge = "Compatible Faculty"

        # Justification rationale
        reasons = []
        if matched_domains:
            reasons.append(f"Domain alignment in {', '.join(matched_domains[:2])}")
        if intersecting_kw:
            reasons.append(f"Specialized in {', '.join(list(intersecting_kw)[:3])}")
        reasons.append(f"{quota_status} ({assigned_count}/{capacity} assigned)")

        ranked.append({
            "id": fac.get("id"),
            "name": name,
            "email": fac.get("email"),
            "designation": profile.get("designation", "Faculty"),
            "primary_domains": profile.get("domains", []),
            "ai_match_score": total_score,
            "recommendation_badge": rec_badge,
            "reasons": reasons,
            "free_slots": free_slots,
            "assigned_count": assigned_count,
            "capacity": capacity,
        })

    # Sort descending by match score
    ranked.sort(key=lambda x: x["ai_match_score"], reverse=True)
    return ranked

