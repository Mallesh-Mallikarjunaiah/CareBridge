export default function MedicationsList({ medications = [] }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    💊 Medications
                </h2>
                <span className="text-xs bg-green-50 text-green-600
                         px-2 py-1 rounded-full font-medium">
                    {medications.length} active
                </span>
            </div>

            {/* List */}
            {medications.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                    No medications found
                </p>
            ) : (
                <div className="space-y-3">
                    {medications.map((med) => (
                        <div key={med.id}
                            className="p-3 bg-green-50 rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-gray-800">
                                    {med.name}
                                </p>
                                <span className="text-xs bg-white text-green-600
                                 border border-green-100
                                 px-2 py-0.5 rounded-full font-medium">
                                    {med.dose}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">{med.frequency}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {med.times.map((time) => (
                                    <span key={time}
                                        className="text-xs bg-white text-gray-600
                                   border border-gray-100
                                   px-2 py-0.5 rounded-full">
                                        🕐 {time}
                                    </span>
                                ))}
                            </div>
                            {med.withFood && (
                                <p className="text-xs text-orange-500 mt-1.5">
                                    🍽️ Take with food
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}