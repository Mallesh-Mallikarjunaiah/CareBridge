// src/pages/CheckIn.jsx
import { useState } from "react";
import Layout from "../components/Layout";

const MOODS = [
  { emoji: "😊", label: "Great", color: "border-green-300 bg-green-50 text-green-700" },
  { emoji: "🙂", label: "Good", color: "border-blue-300 bg-blue-50 text-blue-700" },
  { emoji: "😐", label: "Okay", color: "border-yellow-300 bg-yellow-50 text-yellow-700" },
  { emoji: "😟", label: "Not Good", color: "border-orange-300 bg-orange-50 text-orange-700" },
  { emoji: "😢", label: "Bad", color: "border-red-300 bg-red-50 text-red-700" },
];

const SYMPTOMS = [
  "Headache", "Fatigue", "Nausea", "Pain at wound site",
  "Dizziness", "Fever", "Swelling", "Difficulty sleeping",
  "Loss of appetite", "Shortness of breath", "Bleeding", "Redness around wound",
];

export default function CheckIn() {
  const [mood, setMood] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [painLevel, setPainLevel] = useState(3);
  const [notes, setNotes] = useState("");
  const [medicationsTaken, setMedicationsTaken] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (!mood) return;
    setLoading(true);
    try {
      // TODO: Connect to backend API
      // await api.post("/checkins/", { mood, symptoms: selectedSymptoms, pain_level: painLevel, notes, medications_taken: medicationsTaken });
      await new Promise(res => setTimeout(res, 1000));
      setSubmitted(true);
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMood(null);
    setSelectedSymptoms([]);
    setPainLevel(3);
    setNotes("");
    setMedicationsTaken(true);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check-In Complete!</h2>
            <p className="text-gray-500 mb-2">Thank you for logging today's update.</p>
            {selectedSymptoms.length > 0 && selectedSymptoms.some(s =>
              ["Fever", "Bleeding", "Shortness of breath", "Redness around wound"].includes(s)
            ) && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-left">
                <p className="text-sm font-semibold text-red-600 mb-1">⚠️ Alert</p>
                <p className="text-sm text-red-500">
                  You reported symptoms that may need medical attention.
                  If symptoms worsen, please contact your doctor or visit the ER.
                </p>
              </div>
            )}
            <button
              onClick={resetForm}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Submit Another Check-In
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Daily Check-In ✅</h1>
          <p className="text-gray-500 text-sm mt-1">
            How are you feeling today? Your responses help us monitor your recovery.
          </p>
        </div>

        <div className="space-y-6">
          {/* Mood */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">How are you feeling?</h2>
            <div className="flex flex-wrap gap-3">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                    mood === m.label ? m.color + " shadow-sm" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pain Level */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">Pain Level</h2>
            <p className="text-xs text-gray-400 mb-4">0 = No pain, 10 = Worst pain</p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 w-4">0</span>
              <input
                type="range" min="0" max="10" value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm text-gray-400 w-6">10</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                painLevel <= 3 ? "bg-green-100 text-green-700"
                  : painLevel <= 6 ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {painLevel}
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Any symptoms today?</h2>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedSymptoms.includes(s)
                      ? "bg-red-100 text-red-700 border-2 border-red-300 font-medium"
                      : "bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Did you take all medications today?</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setMedicationsTaken(true)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  medicationsTaken
                    ? "border-green-400 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                ✅ Yes, all taken
              </button>
              <button
                onClick={() => setMedicationsTaken(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  !medicationsTaken
                    ? "border-red-400 bg-red-50 text-red-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                ❌ Missed some
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Additional notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none text-sm"
              rows="3"
              placeholder="Anything else you want to share about how you're feeling..."
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!mood || loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Check-In"}
          </button>
        </div>
      </div>
    </Layout>
  );
}