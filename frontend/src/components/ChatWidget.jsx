// src/components/ChatWidget.jsx

// RAG chat widget — user asks questions about their documents

import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {

    const [messages, setMessages] = useState([

        {

            role: "assistant",

            text: "Hi! I'm your CareBridge assistant. Ask me anything about your medical documents, appointments, or medications. 💊"

        }

    ]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    // Auto scroll to latest message

    useEffect(() => {

        bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    }, [messages]);

    const sendMessage = async () => {

        if (!input.trim()) return;

        const userMessage = input.trim();

        setInput("");

        // Add user message to chat

        setMessages(prev => [...prev, { role: "user", text: userMessage }]);

        setLoading(true);

        try {

            // TODO: Connect to backend RAG API

            // const res = await api.post("/chat/message", { message: userMessage });

            // const answer = res.data.answer;

            // Simulate AI response for now

            await new Promise(res => setTimeout(res, 1000));

            const answer = "I found that information in your discharge documents. This feature will be fully connected to your documents once the backend is ready.";

            setMessages(prev => [...prev, { role: "assistant", text: answer }]);

        } catch {

            setMessages(prev => [...prev, {

                role: "assistant",

                text: "Sorry, I couldn't process that. Please try again."

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

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100

                    flex flex-col" style={{ height: "380px" }}>

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">

                    💬 Ask AI Assistant
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">

                    Ask questions about your documents
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

                {messages.map((msg, i) => (
                    <div key={i}

                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs px-3.5 py-2.5 rounded-2xl text-sm

              ${msg.role === "user"

                                ? "bg-blue-600 text-white rounded-br-sm"

                                : "bg-gray-100 text-gray-800 rounded-bl-sm"

                            }`}>

                            {msg.text}
                        </div>
                    </div>

                ))}

                {/* Loading indicator */}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"

                                    style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"

                                    style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"

                                    style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>

                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2 bg-gray-50

                        rounded-xl border border-gray-200 px-3 py-2">
                    <input

                        type="text"

                        value={input}

                        onChange={e => setInput(e.target.value)}

                        onKeyDown={handleKeyDown}

                        placeholder="Ask about your medications..."

                        disabled={loading}

                        className="flex-1 bg-transparent text-sm text-gray-800

                       placeholder-gray-400 outline-none"

                    />
                    <button

                        onClick={sendMessage}

                        disabled={loading || !input.trim()}

                        className="w-8 h-8 bg-blue-600 rounded-lg flex items-center

                       justify-center text-white text-sm

                       hover:bg-blue-700 transition disabled:opacity-50"
                    >

                        ➤
                    </button>
                </div>
            </div>

        </div>

    );

}
