import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json
import os
from dotenv import load_dotenv

load_dotenv()

vertexai.init(
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
)

MODEL = "gemini-2.0-flash"

# ─────────────────────────────────────────────────────
# 1. VISION — Extract structured data from PDF/photo
# ─────────────────────────────────────────────────────
def extract_discharge_data(file_bytes: bytes, mime_type: str) -> dict:
    prompt = """
    You are a medical document parser. 
    Extract ALL information from this hospital discharge document carefully.
    
    IMPORTANT: This is a medical document. Accuracy is critical.
    Do not guess or hallucinate any medical information.
    If a field is not found, return empty string or empty list.
    
    Return ONLY valid JSON in this exact format, nothing else:
    {
        "patient_name": "",
        "patient_age": "",
        "patient_id": "",
        "discharge_date": "",
        "admission_date": "",
        "follow_up_date": "",
        "follow_up_time": "",
        "follow_up_location": "",
        "doctor_name": "",
        "department": "",
        "diagnosis": [],
        "medications": [
            {
                "name": "",
                "dose": "",
                "frequency": "",
                "duration": "",
                "instructions": "",
                "timing": ""
            }
        ],
        "warnings": [],
        "allergies": [],
        "conditions": [],
        "instructions": [],
        "diet_restrictions": [],
        "activity_restrictions": [],
        "emergency_signs": [],
        "tests_ordered": [],
        "raw_text": ""
    }
    
    No markdown. No explanation. JSON only.
    """

    model = GenerativeModel(MODEL)
    part = Part.from_data(data=file_bytes, mime_type=mime_type)
    response = model.generate_content([part, prompt])

    raw = response.text.strip()
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)


# ─────────────────────────────────────────────────────
# 2. MULTI FILE — Process multiple photos/pages
# ─────────────────────────────────────────────────────
def extract_from_multiple_files(files: list[dict]) -> dict:
    extractions = []

    for file in files:
        try:
            extracted = extract_discharge_data(
                file["bytes"],
                file["mime_type"]
            )
            extractions.append(extracted)
        except Exception as e:
            print(f"Error extracting file: {e}")
            continue

    if len(extractions) == 1:
        return extractions[0]

    return merge_extractions(extractions)


# ─────────────────────────────────────────────────────
# 3. MERGE — Combine multiple page extractions
# ─────────────────────────────────────────────────────
def merge_extractions(extractions: list[dict]) -> dict:
    prompt = f"""
    You are a medical data merger.
    These are extractions from multiple pages of the SAME discharge document.
    
    IMPORTANT RULES:
    - Merge ALL extractions into ONE complete record
    - If same field appears multiple times, keep the most detailed version
    - If conflicting medication values found, flag as "NEEDS_VERIFICATION"
    - NEVER drop any medication, warning, or instruction
    - When in doubt, INCLUDE — never exclude medical information
    - Patient safety is the priority
    
    Extractions:
    {json.dumps(extractions, indent=2)}
    
    Return ONE merged JSON in the same structure.
    No markdown. No explanation. JSON only.
    """

    model = GenerativeModel(MODEL)
    response = model.generate_content(prompt)
    raw = response.text.strip()
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)


# ─────────────────────────────────────────────────────
# 4. VERIFY — Check accuracy of extracted data
# ─────────────────────────────────────────────────────
def verify_extraction(extracted: dict) -> dict:
    prompt = f"""
    You are a medical accuracy checker.
    Review this extracted discharge data for errors or missing info.
    
    Check for:
    - Missing critical fields (medications, dosage, frequency)
    - Impossible values (negative doses, wrong date formats)
    - Incomplete medication instructions
    - Missing warnings or allergies
    - Any field marked NEEDS_VERIFICATION
    - Medications without dosage or frequency
    
    Extracted data:
    {json.dumps(extracted, indent=2)}
    
    Return ONLY valid JSON:
    {{
        "verified": true,
        "confidence_score": 0,
        "flags": [],
        "verified_data": {{}}
    }}
    
    No markdown. No explanation. JSON only.
    """

    model = GenerativeModel(MODEL)
    response = model.generate_content(prompt)
    raw = response.text.strip()
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)


# ─────────────────────────────────────────────────────
# 5. TRANSLATE — Medical jargon to plain English
# ─────────────────────────────────────────────────────
def translate_to_plain_language(discharge_data: dict) -> dict:
    prompt = f"""
    You are CareBridge, a friendly health assistant.
    Translate this medical discharge data into plain simple English.
    
    RULES:
    - Use words a 10-year-old understands
    - No medical jargon whatsoever
    - Short simple sentences
    - Warm friendly tone
    - Keep ALL facts 100% accurate — never change medical facts
    - Do not add information not in the original
    
    Discharge data:
    {json.dumps(discharge_data, indent=2)}
    
    Return ONLY valid JSON in the same structure but plain language values.
    No markdown. No explanation. JSON only.
    """

    model = GenerativeModel(MODEL)
    response = model.generate_content(prompt)
    raw = response.text.strip()
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)


# ─────────────────────────────────────────────────────
# 6. CHAT — Answer patient question using RAG context
# ─────────────────────────────────────────────────────
def chat_with_patient(
    patient_message: str,
    rag_context: str,
    chat_history: list
) -> dict:
    history_text = ""
    for msg in chat_history[-6:]:
        role = "Patient" if msg["role"] == "user" else "CareBridge"
        history_text += f"{role}: {msg['content']}\n"

    prompt = f"""
    You are CareBridge, a warm and caring post-discharge assistant.
    
    Patient's discharge information:
    {rag_context}
    
    Conversation so far:
    {history_text}
    
    Patient just said: {patient_message}
    
    RULES:
    - Answer ONLY from the discharge information above
    - Use plain simple everyday English — no medical jargon
    - Short sentences, calm and warm tone
    - If answer not in discharge notes, say: 
      "I don't have that information. Please call your nurse."
    - NEVER guess or make up medical information
    - If patient mentions: chest pain, difficulty breathing, 
      heavy bleeding, severe pain, unconscious, seizure, allergic reaction
      set escalate to true immediately
    - For medication questions always add safety disclaimer
    
    Return ONLY valid JSON:
    {{
        "response": "your plain English response here",
        "escalate": false,
        "escalation_reason": "",
        "urgency": "low"
    }}
    
    No markdown. No explanation. JSON only.
    """

    model = GenerativeModel(MODEL)
    response = model.generate_content(prompt)
    raw = response.text.strip()
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)


# ─────────────────────────────────────────────────────
# 7. CHEAT SHEET — Generate plain language summary
# ─────────────────────────────────────────────────────
def generate_cheat_sheet(discharge_data: dict) -> str:
    prompt = f"""
    You are CareBridge, a friendly health assistant.
    Create a simple recovery cheat sheet for this patient.
    
    Discharge data:
    {json.dumps(discharge_data, indent=2)}
    
    Format as plain text with sections:
    YOUR MEDICATIONS
    YOUR APPOINTMENTS  
    IMPORTANT WARNINGS
    EMERGENCY SIGNS — CALL 911 IF YOU HAVE:
    YOUR DAILY SCHEDULE
    
    Use simple language. Be warm and reassuring.
    """

    model = GenerativeModel(MODEL)
    response = model.generate_content(prompt)
    return response.text.strip()