// src/pages/CheatSheet.jsx
import Layout from "../components/Layout";

const CHEAT_SHEET = {
  medications: [
    { name: "Amoxicillin", dose: "500mg", frequency: "3 times daily", times: "8 AM, 2 PM, 8 PM", instructions: "Take with food. Complete full course.", duration: "7 days" },
    { name: "Ibuprofen", dose: "400mg", frequency: "2 times daily", times: "9 AM, 9 PM", instructions: "Take with food. Stop if stomach upset.", duration: "As needed" },
  ],
  appointments: [
    { doctor: "Dr. Sarah Williams", purpose: "Post-op wound check", date: "March 15, 2024", time: "10:30 AM", location: "St. Mary's Clinic, Room 204" },
    { doctor: "Dr. James Lee", purpose: "Blood work follow-up", date: "March 22, 2024", time: "2:00 PM", location: "Main Lab, Floor 3" },
  ],
  warnings: [
    "Do not lift anything heavier than 10 pounds for 2 weeks",
    "Avoid soaking the wound — showers are okay, no baths",
    "No driving while taking pain medication",
    "Avoid alcohol while on antibiotics",
  ],
  emergencySigns: [
    "Fever above 101°F (38.3°C)",
    "Heavy bleeding from wound site",
    "Increasing redness or swelling around wound",
    "Chest pain or difficulty breathing",
    "Severe pain not relieved by medication",
    "Signs of allergic reaction (rash, swelling, trouble breathing)",
  ],
  dailySchedule: [
    { time: "8:00 AM", task: "Take Amoxicillin 500mg (with breakfast)" },
    { time: "9:00 AM", task: "Take Ibuprofen 400mg (with food)" },
    { time: "9:00 AM", task: "Change wound dressing" },
    { time: "10:00 AM", task: "Light walk (10-15 minutes)" },
    { time: "2:00 PM", task: "Take Amoxicillin 500mg (with lunch)" },
    { time: "8:00 PM", task: "Take Amoxicillin 500mg (with dinner)" },
    { time: "9:00 PM", task: "Take Ibuprofen 400mg (with snack)" },
    { time: "9:00 PM", task: "Apply antibiotic ointment to wound" },
  ],
};

export default function CheatSheet() {
  const handlePrint = () => window.print();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Care Cheat Sheet 📋</h1>
            <p className="text-gray-500 text-sm mt-1">
              Your simplified care plan — all in one place
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            🖨️ Print / Save PDF
          </button>
        </div>

        <div className="space-y-6 print:space-y-4">
          {/* Medications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              💊 Your Medications
            </h2>
            <div className="space-y-4">
              {CHEAT_SHEET.medications.map((med, i) => (
                <div key={i} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{med.name}</h3>
                    <span className="text-sm font-semibold text-blue-600">{med.dose}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>📅 {med.frequency}</p>
                    <p>⏰ {med.times}</p>
                    <p>📝 {med.instructions}</p>
                    <p>📆 Duration: {med.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              📅 Your Appointments
            </h2>
            <div className="space-y-3">
              {CHEAT_SHEET.appointments.map((apt, i) => (
                <div key={i} className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-bold text-gray-800">{apt.doctor}</h3>
                  <p className="text-sm text-gray-600 mt-1">{apt.purpose}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <span>📅 {apt.date}</span>
                    <span>⏰ {apt.time}</span>
                    <span>📍 {apt.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              ⚠️ Important Warnings
            </h2>
            <div className="space-y-2">
              {CHEAT_SHEET.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-3 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                  <span className="text-amber-500 mt-0.5">⚠️</span>
                  <p className="text-sm text-gray-700">{w}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Signs */}
          <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6">
            <h2 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-4">
              🚨 CALL 911 OR GO TO ER IF YOU HAVE:
            </h2>
            <div className="space-y-2">
              {CHEAT_SHEET.emergencySigns.map((sign, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <p className="text-sm font-medium text-red-700">{sign}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Schedule */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              🕐 Your Daily Schedule
            </h2>
            <div className="space-y-2">
              {CHEAT_SHEET.dailySchedule.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-mono font-bold text-blue-600 w-20 flex-shrink-0">
                    {item.time}
                  </span>
                  <p className="text-sm text-gray-700">{item.task}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Contact */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-bold mb-2">📞 Need Help?</h2>
            <p className="text-blue-100 text-sm mb-4">
              If you have questions about your recovery, don't hesitate to reach out.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="font-medium">Doctor's Office</p>
                <p className="text-blue-200">(555) 123-4567</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="font-medium">Nurse Line (24/7)</p>
                <p className="text-blue-200">(555) 987-6543</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}