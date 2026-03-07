import Layout from "../components/Layout";
import AppointmentsList from "../components/AppointmentsList";
import MedicationsList from "../components/MedicationsList";
import WoundCareTasks from "../components/WoundCareTasks";
import ChatWidget from "../components/ChatWidget";
import { useAuth } from "../context/AuthContext";

// ── Placeholder data — replace with real API data later ──────────
const MOCK_DATA = {
  appointments: [
    {
      id: 1, doctor: "Dr. Sarah Williams", purpose: "Post-op wound check",
      date: "2024-03-15", time: "10:30 AM", location: "St. Mary's Clinic"
    },
    {
      id: 2, doctor: "Dr. James Lee", purpose: "Blood work follow-up",
      date: "2024-03-22", time: "2:00 PM", location: "Main Lab, Floor 3"
    },
  ],
  medications: [
    {
      id: 1, name: "Amoxicillin", dose: "500mg", frequency: "3x daily",
      times: ["8:00 AM", "2:00 PM", "8:00 PM"], withFood: true
    },
    {
      id: 2, name: "Ibuprofen", dose: "400mg", frequency: "2x daily",
      times: ["9:00 AM", "9:00 PM"], withFood: true
    },
  ],
  woundCare: [
    {
      id: 1, task: "Change wound dressing",
      instruction: "Clean with saline, apply fresh gauze",
      frequency: "Once daily", time: "9:00 AM"
    },
    {
      id: 2, task: "Apply antibiotic ointment",
      instruction: "Apply thin layer to incision site",
      frequency: "Twice daily", time: "9:00 AM & 9:00 PM"
    },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.full_name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here is your recovery plan overview.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Appointments", value: MOCK_DATA.appointments.length, icon: "📅", color: "blue" },
            { label: "Medications", value: MOCK_DATA.medications.length, icon: "💊", color: "green" },
            { label: "Wound Tasks", value: MOCK_DATA.woundCare.length, icon: "🩹", color: "orange" },
          ].map((stat) => (
            <div key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-6">

          {/* Left column */}
          <div className="space-y-6">
            <AppointmentsList appointments={MOCK_DATA.appointments} />
            <WoundCareTasks woundCare={MOCK_DATA.woundCare} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <MedicationsList medications={MOCK_DATA.medications} />
            <ChatWidget />
          </div>

        </div>
      </div>
    </Layout>
  );
}