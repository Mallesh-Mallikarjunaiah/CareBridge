import vertexai
from vertexai.language_models import TextEmbeddingModel
import chromadb
import os
from dotenv import load_dotenv

load_dotenv()

vertexai.init(
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
)

# Local ChromaDB — no server needed
chroma_client = chromadb.PersistentClient(path="./chroma_db")
COLLECTION_NAME = "discharge_docs"


def get_or_create_collection():
    return chroma_client.get_or_create_collection(
        name=COLLECTION_NAME
    )


# ─────────────────────────────────────────────────────
# 1. EMBED — Get embedding for a text chunk
# ─────────────────────────────────────────────────────
def get_embedding(text: str) -> list[float]:
    model = TextEmbeddingModel.from_pretrained("text-embedding-004")
    embeddings = model.get_embeddings([text])
    return embeddings[0].values


# ─────────────────────────────────────────────────────
# 2. CHUNK — Split discharge text into chunks
# ─────────────────────────────────────────────────────
def chunk_discharge_data(discharge_data: dict) -> list[str]:
    chunks = []

    chunks.append(f"""
    Patient: {discharge_data.get('patient_name', '')}
    Age: {discharge_data.get('patient_age', '')}
    Discharge Date: {discharge_data.get('discharge_date', '')}
    Doctor: {discharge_data.get('doctor_name', '')}
    Department: {discharge_data.get('department', '')}
    Diagnosis: {', '.join(discharge_data.get('diagnosis', []))}
    """)

    for med in discharge_data.get('medications', []):
        chunks.append(f"""
        Medication: {med.get('name', '')}
        Dose: {med.get('dose', '')}
        Frequency: {med.get('frequency', '')}
        Duration: {med.get('duration', '')}
        Timing: {med.get('timing', '')}
        Instructions: {med.get('instructions', '')}
        """)

    if discharge_data.get('warnings'):
        chunks.append(f"""
        Warnings: {', '.join(discharge_data.get('warnings', []))}
        Allergies: {', '.join(discharge_data.get('allergies', []))}
        """)

    chunks.append(f"""
    Follow-up Date: {discharge_data.get('follow_up_date', '')}
    Follow-up Time: {discharge_data.get('follow_up_time', '')}
    Follow-up Location: {discharge_data.get('follow_up_location', '')}
    Tests Ordered: {', '.join(discharge_data.get('tests_ordered', []))}
    """)

    if discharge_data.get('instructions'):
        chunks.append(f"""
        Instructions: {', '.join(discharge_data.get('instructions', []))}
        Diet Restrictions: {', '.join(discharge_data.get('diet_restrictions', []))}
        Activity Restrictions: {', '.join(discharge_data.get('activity_restrictions', []))}
        """)

    if discharge_data.get('emergency_signs'):
        chunks.append(f"""
        Emergency Signs — Call 911 if:
        {', '.join(discharge_data.get('emergency_signs', []))}
        """)

    return [c.strip() for c in chunks if c.strip()]


# ─────────────────────────────────────────────────────
# 3. INDEX — Store discharge doc in ChromaDB
# ─────────────────────────────────────────────────────
def index_patient_discharge(patient_id: str, discharge_data: dict):
    collection = get_or_create_collection()

    try:
        collection.delete(where={"patient_id": patient_id})
    except Exception:
        pass

    chunks = chunk_discharge_data(discharge_data)

    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            ids=[f"{patient_id}_chunk_{i}"],
            metadatas=[{"patient_id": patient_id, "chunk_index": i}]
        )

    print(f"✅ Indexed {len(chunks)} chunks for patient {patient_id}")
    return len(chunks)


# ─────────────────────────────────────────────────────
# 4. RETRIEVE — Get relevant chunks for a question
# ─────────────────────────────────────────────────────
def retrieve_relevant_chunks(
    patient_id: str,
    question: str,
    top_k: int = 3
) -> str:
    collection = get_or_create_collection()

    question_embedding = get_embedding(question)

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k,
        where={"patient_id": patient_id}
    )

    if not results["documents"][0]:
        return "No relevant information found in discharge document."

    return "\n\n".join(results["documents"][0])