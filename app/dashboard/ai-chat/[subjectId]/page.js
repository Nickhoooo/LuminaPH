"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/lib/DashboardContext";
import { ChevronLeft, Send, Loader, MessageCircle } from "lucide-react";

export default function AIChat() {
  const router = useRouter();
  const { subjectId } = useParams();
  const { profile } = useDashboard();
  const bottomRef = useRef(null);

  const [subject, setSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      setSubject(subject);

      const { data: conversation } = await supabase
        .from("ai_conversations")
        .select("*")
        .eq("subject_id", subjectId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (conversation) {
        setMessages(conversation.messages);
      } else {
        setMessages([
          {
            role: "assistant",
            content: `Kumusta! Ako ang iyong AI Teacher para sa **${subject?.title}**. Ano ang gusto mong malaman? 😊`,
          },
        ]);
      }

      setLoading(false);
    };

    getData();
  }, [subjectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/ai-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          subject_title: subject?.title,
          subject_description: subject?.description,
        }),
      });

      const { reply } = await response.json();

      const aiMessage = { role: "assistant", content: reply };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase
        .from("ai_conversations")
        .upsert({
          user_id: user.id,
          subject_id: subjectId,
          title: `Chat about ${subject?.title}`,
          messages: finalMessages,
          updated_at: new Date().toISOString(),
        });

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading AI Teacher...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 lg:py-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">AI Teacher</h1>
              <p className="text-sm text-gray-600">{subject?.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="w-12 h-12 text-emerald-300 mb-4" />
              <p className="text-gray-500">No messages yet. Start asking!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* AI Avatar */}
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
                      🤖
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-xl lg:max-w-2xl px-4 py-3 rounded-2xl text-sm lg:text-base leading-relaxed shadow-sm transition-all
                      ${
                        message.role === "user"
                          ? "bg-emerald-500 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-700 rounded-bl-none"
                      }`}
                  >
                    {message.content}
                  </div>

                  {/* User Avatar */}
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                      {profile?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {sending && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
                    🤖
                  </div>
                  <div className="max-w-xl bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 px-4 lg:px-8 py-4 lg:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Ask your AI teacher anything..."
              disabled={sending}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white px-4 lg:px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 hidden sm:inline" />
                  <span className="hidden sm:inline">Send</span>
                  <span className="sm:hidden">→</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Enter to send • Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}