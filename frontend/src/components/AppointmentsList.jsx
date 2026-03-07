export default function AppointmentsList({ appointments = [] }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    📅 Upcoming Appointments
                </h2>
                <span className="text-xs bg-blue-50 text-blue-600
                         px-2 py-1 rounded-full font-medium">
                    {appointments.length} total
                </span>
            </div>

            {/* List */}
            {appointments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                    No appointments found
                </p>
            ) : (
                <div className="space-y-3">
                    {appointments.map((appt) => (
                        <div key={appt.id}
                            className="flex items-start gap-3 p-3
                            bg-blue-50 rounded-xl">
                            <div className="w-10 h-10 rounded-xl bg-blue-100
                              flex items-center justify-center
                              text-blue-600 flex-shrink-0 text-lg">
                                🏥
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">
                                    {appt.doctor}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {appt.purpose}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-xs text-blue-600 font-medium">
                                        📆 {appt.date}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        🕐 {appt.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}