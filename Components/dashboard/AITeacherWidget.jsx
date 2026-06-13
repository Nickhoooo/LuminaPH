"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AITeacherWidget({ profile }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Kumusta ${profile?.name}! 😊 Ako ang iyong AI Teacher. Ano ang gusto mong malaman ngayon?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await fetch("/api/ai-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          subject_title: "General",
          subject_description: `Student profile: ${profile?.course}, ${profile?.year_level}`,
        }),
      });

      const { reply } = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl flex flex-col overflow-hidden z-50"
          style={{ height: "400px" }}>

          {/* Header */}
          <div className="bg-emerald-400 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🤖</span>
              <p className="text-white text-sm font-medium">AI Teacher</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white opacity-75 hover:opacity-100 text-lg"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed
                  ${msg.role === "user"
                    ? "bg-orange-400 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-700 rounded-tl-none"
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Sending indicator */}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
            />
            <button
              onClick={sendMessage}
              disabled={sending}
              className="bg-emerald-400 text-white text-xs px-3 py-2 rounded-lg hover:bg-emerald-500 disabled:opacity-50"
            >
              →
            </button>
          </div>

        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center text-xl shadow-lg hover:bg-emerald-500 transition-all z-50"
      >
        {open ? "×" : "🤖"}
      </button>
    </>
  );
}