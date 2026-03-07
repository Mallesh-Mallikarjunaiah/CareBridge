from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import hashlib
from app.services.gemini import extract_from_multiple_files, verify_extraction, translate_to_plain_language
from app.services.embeddings import index_patient_discharge

router = APIRouter()
uploaded_hashes = {}

@router.post("/upload/{patient_id}")
async def upload_documents(
    patient_id: str,
    files: List[UploadFile] = File(...)
):
    try:
        unique_files = []

        for file in files:
            content = await file.read()
            file_hash = hashlib.md5(content).hexdigest()

            if file_hash in uploaded_hashes.get(patient_id, []):
                print(f"Skipping duplicate: {file.filename}")
                continue

            uploaded_hashes.setdefault(patient_id, []).append(file_hash)
            unique_files.append({
                "bytes": content,
                "mime_type": file.content_type
            })

        if not unique_files:
            raise HTTPException(
                status_code=400,
                detail="All files are duplicates"
            )

        extracted = extract_from_multiple_files(unique_files)
        verified = verify_extraction(extracted)
        plain = translate_to_plain_language(verified["verified_data"])
        index_patient_discharge(patient_id, plain)

        return {
            "patient_id": patient_id,
            "confidence_score": verified["confidence_score"],
            "flags": verified["flags"],
            "data": plain
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))