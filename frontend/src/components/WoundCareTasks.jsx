// src/components/WoundCareTasks.jsx

import { useState } from "react";

export default function WoundCareTasks({ woundCare = [] }) {

    // Track which tasks are marked done today

    const [done, setDone] = useState([]);

    const toggleDone = (id) => {

        setDone(prev =>

            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]

        );

    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">

                    🩹 Wound Care Tasks
                </h2>
                <span className="text-xs bg-orange-50 text-orange-600

                         px-2 py-1 rounded-full font-medium">

                    {done.length}/{woundCare.length} done
                </span>
            </div>

            {/* List */}

            {woundCare.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">

                    No wound care tasks found
                </p>

            ) : (
                <div className="space-y-3">

                    {woundCare.map((task) => (
                        <div key={task.id}

                            className={`p-3 rounded-xl border transition-all

                   ${done.includes(task.id)

                                    ? "bg-gray-50 border-gray-100 opacity-60"

                                    : "bg-orange-50 border-orange-100"

                                }`}
                        >
                            <div className="flex items-start gap-3">

                                {/* Checkbox */}
                                <button

                                    onClick={() => toggleDone(task.id)}

                                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0

                              flex items-center justify-center mt-0.5

                              transition-all

                              ${done.includes(task.id)

                                            ? "bg-green-500 border-green-500"

                                            : "border-orange-300"

                                        }`}
                                >

                                    {done.includes(task.id) && (
                                        <span className="text-white text-xs">✓</span>

                                    )}
                                </button>

                                <div className="flex-1">
                                    <p className={`text-sm font-medium

                    ${done.includes(task.id)

                                            ? "line-through text-gray-400"

                                            : "text-gray-800"

                                        }`}>

                                        {task.task}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">

                                        {task.instruction}
                                    </p>
                                    <p className="text-xs text-orange-500 mt-1">

                                        🔁 {task.frequency} · 🕐 {task.time}
                                    </p>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>

            )}
        </div>

    );

}
