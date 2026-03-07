from gtts import gTTS
import os
import uuid

def text_to_speech(text: str) -> str:
    filename = f"audio_{uuid.uuid4().hex}.mp3"
    output_path = f"./audio/{filename}"
    os.makedirs("./audio", exist_ok=True)
    tts = gTTS(text=text, lang='en', slow=False)
    tts.save(output_path)
    return output_path