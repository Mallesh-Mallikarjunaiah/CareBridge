// src/pages/ChatPage.jsx
// Full-page AI chat experience
import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your CareBridge assistant. 👋\n\nAsk me anything about your discharge documents, medications, appointments, or recovery plan. I'm here to help you understand your care in simple language."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await api.post("/chat", {
        patient_id: "current",
        message: userMessage,
        chat_history: messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }))
      });
      setMessages(prev => [...prev, {
        role: "assistant",
        text: res.data.response,
        escalate: res.data.escalate,
        urgency: res.data.urgency
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "I'm having trouble connecting right now. Please try again in a moment, or contact your nurse if this is urgent."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What medications should I take today?",
    "When is my next appointment?",
    "What are my warning signs?",
    "Can I take a shower?",
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 100px)" }}>
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Ask AI Assistant 💬</h1>
          <p className="text-gray-500 text-sm mt-1">
            Get answers about your discharge documents in simple language
          </p>
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => { setInput(q); }}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-50 text-gray-800 rounded-bl-sm border border-gray-100"
              }`}>
                {msg.text.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-2" : ""}>{line}</p>
                ))}
                {msg.escalate && (
                  <div className="mt-2 bg-red-100 text-red-700 rounded-lg px-3 py-2 text-xs font-medium">
                    ⚠️ This may need immediate attention. Please contact your doctor.
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-100">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your medications, appointments, recovery..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}