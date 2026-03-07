from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag import get_rag_context
from app.services.gemini import chat_with_patient
from app.services.tts import text_to_speech

router = APIRouter()

class ChatRequest(BaseModel):
    patient_id: str
    message: str
    chat_history: list = []

class ChatResponse(BaseModel):
    response: str
    audio_path: str
    escalate: bool
    urgency: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Step 1 — Get relevant context from discharge doc
        context = get_rag_context(
            patient_id=request.patient_id,
            question=request.message
        )

        # Step 2 — Get Gemini response
        result = chat_with_patient(
            patient_message=request.message,
            rag_context=context,
            chat_history=request.chat_history
        )

        # Step 3 — Convert response to speech
        audio_path = text_to_speech(result["response"])

        return ChatResponse(
            response=result["response"],
            audio_path=audio_path,
            escalate=result["escalate"],
            urgency=result["urgency"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
