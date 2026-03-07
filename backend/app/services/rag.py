from app.services.embeddings import retrieve_relevant_chunks

def get_rag_context(patient_id: str, question: str) -> str:
    context = retrieve_relevant_chunks(
        patient_id=patient_id,
        question=question,
        top_k=3
    )
    return context
