"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Content } from "next/font/google";


export default function AIChat() {
  const router = useRouter();
  const { subjectId } = useParams();
  const bottomRef = useRef(null);

  const [subject, setSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

useEffect(() => {
    const getData = async () => {
      // I-check kung may naka-login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Kunin yung subject info
      const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      setSubject(subject);

      // Kunin yung previous conversation
      const { data: conversation } = await supabase
        .from("ai_conversations")
        .select("*")
        .eq("subject_id", subjectId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (conversation) {
        setMessages(conversation.messages);
      } else {
        // Wala pang conversation — mag-add ng welcome message!
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

  // Auto-scroll sa pinakabagong message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    // I-add yung message ng user sa chat
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setSending(true);

    try {
      // I-send sa AI
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

      // I-add yung reply ng AI sa chat
      const aiMessage = { role: "assistant", content: reply };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // I-save sa Supabase
      await supabase
        .from("ai_conversations")
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user.id,
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
      <main className="min-h-screen bg-[#FFF5EB] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#FFF5EB] flex flex-col">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-10 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="font-serif text-xl cursor-pointer">
            Lumina<span className="text-orange-500">PH</span>
          </div>
        </Link>
        <div className="text-sm font-medium text-gray-600">
          🤖 AI Teacher — {subject?.title}
        </div>
        <Link href="/dashboard">
          <button className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            ← Back
          </button>
        </Link>
      </nav>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        {messages.map((message, i) => (
          <div key={i} className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            
            {/* AI Avatar */}
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm mr-3 mt-1">
                🤖
              </div>
            )}

            {/* Message Bubble */}
            <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${message.role === "user"
                ? "bg-orange-400 text-white rounded-tr-none"
                : "bg-white border border-gray-100 text-gray-700 rounded-tl-none"
              }`}>
              {message.content}
            </div>

            {/* User Avatar */}
            {message.role === "user" && (
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-sm ml-3 mt-1 text-white font-medium">
                U
              </div>
            )}

          </div>
        ))}

        {/* Sending indicator */}
        {sending && (
          <div className="flex mb-4 justify-start">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm mr-3">
              🤖
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask your AI teacher anything..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400"
          />
          <button
            onClick={sendMessage}
            disabled={sending}
            className="bg-orange-400 text-white px-6 py-3 rounded-xl text-sm hover:bg-orange-500 disabled:opacity-50"
          >
            {sending ? "..." : "Send →"}
          </button>
        </div>
      </div>

    </main>
  );

}