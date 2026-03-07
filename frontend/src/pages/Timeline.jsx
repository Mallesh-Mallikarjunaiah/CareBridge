// src/pages/Timeline.jsx
import { useState } from "react";
import Layout from "../components/Layout";

const RECOVERY_TIMELINE = [
  {
    day: "Day 1-2",
    title: "Immediate Post-Discharge",
    status: "completed",
    tasks: [
      { text: "Pick up prescribed medications", done: true },
      { text: "Set up recovery area at home", done: true },
      { text: "Review discharge instructions", done: true },
    ],
    tips: "Rest is your top priority. Don't try to do too much.",
  },
  {
    day: "Day 3-5",
    title: "Early Recovery",
    status: "active",
    tasks: [
      { text: "Take all medications on schedule", done: true },
      { text: "Change wound dressing daily", done: false },
      { text: "Light walking (5-10 min)", done: false },
      { text: "Monitor for warning signs", done: false },
    ],
    tips: "Start gentle movement. Stay hydrated and eat nutritious meals.",
  },
  {
    day: "Day 6-10",
    title: "Building Strength",
    status: "upcoming",
    tasks: [
      { text: "Increase walking to 15-20 min", done: false },
      { text: "Resume light daily activities", done: false },
      { text: "Continue wound care routine", done: false },
    ],
    tips: "Listen to your body. If something hurts, slow down.",
  },
  {
    day: "Day 11-14",
    title: "Follow-Up Visit",
    status: "upcoming",
    tasks: [
      { text: "Attend follow-up appointment", done: false },
      { text: "Prepare questions for doctor", done: false },
      { text: "Get wound checked", done: false },
      { text: "Review medication adjustments", done: false },
    ],
    tips: "Write down any symptoms or concerns to discuss with your doctor.",
  },
  {
    day: "Week 3-4",
    title: "Full Recovery",
    status: "upcoming",
    tasks: [
      { text: "Gradually return to normal activities", done: false },
      { text: "Complete all medication courses", done: false },
      { text: "Schedule any follow-up tests", done: false },
    ],
    tips: "You're almost there! Keep up the great work.",
  },
];

export default function Timeline() {
  const [timeline, setTimeline] = useState(RECOVERY_TIMELINE);

  const toggleTask = (phaseIndex, taskIndex) => {
    setTimeline(prev => {
      const updated = [...prev];
      const phase = { ...updated[phaseIndex] };
      const tasks = [...phase.tasks];
      tasks[taskIndex] = { ...tasks[taskIndex], done: !tasks[taskIndex].done };
      phase.tasks = tasks;
      updated[phaseIndex] = phase;
      return updated;
    });
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-green-500";
    if (status === "active") return "bg-blue-500";
    return "bg-gray-300";
  };

  const getStatusBadge = (status) => {
    if (status === "completed") return { text: "Completed", color: "bg-green-50 text-green-600" };
    if (status === "active") return { text: "In Progress", color: "bg-blue-50 text-blue-600" };
    return { text: "Upcoming", color: "bg-gray-50 text-gray-500" };
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Recovery Timeline 📅</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your recovery milestones and daily tasks
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round(
                (timeline.flatMap(p => p.tasks).filter(t => t.done).length /
                  timeline.flatMap(p => p.tasks).length) * 100
              )}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(timeline.flatMap(p => p.tasks).filter(t => t.done).length /
                  timeline.flatMap(p => p.tasks).length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {timeline.map((phase, phaseIdx) => {
            const badge = getStatusBadge(phase.status);
            const completedTasks = phase.tasks.filter(t => t.done).length;

            return (
              <div key={phaseIdx} className={`bg-white rounded-2xl shadow-sm border p-6 transition-all ${
                phase.status === "active" ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100"
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(phase.status)}`} />
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {phase.day}
                      </span>
                      <h3 className="text-lg font-bold text-gray-800">{phase.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {completedTasks}/{phase.tasks.length}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-2 ml-6">
                  {phase.tasks.map((task, taskIdx) => (
                    <button
                      key={taskIdx}
                      onClick={() => toggleTask(phaseIdx, taskIdx)}
                      className="flex items-center gap-3 w-full text-left py-1.5 group"
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        task.done
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 group-hover:border-blue-400"
                      }`}>
                        {task.done && <span className="text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${
                        task.done ? "text-gray-400 line-through" : "text-gray-700"
                      }`}>
                        {task.text}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Tip */}
                {phase.tips && (
                  <div className="mt-4 ml-6 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <p className="text-sm text-amber-700">
                      <span className="font-medium">💡 Tip:</span> {phase.tips}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}