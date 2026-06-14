"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/lib/DashboardContext";
import { Send, MessageSquare, Loader, Users } from "lucide-react";

export default function GlobalChat() {
  const router = useRouter();
  const bottomRef = useRef(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { profile } = useDashboard();

  useEffect(() => {
    let subscription = null;

    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: existingMessages } = await supabase
        .from("messages")
        .select("*, sender:profiles!messages_sender_id_fkey(name)")
        .is("receiver_id", null)
        .order("created_at", { ascending: true });

      setMessages(existingMessages || []);
      setLoading(false);

      subscription = supabase
        .channel(`global-chat-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: "receiver_id=is.null",
          },
          async (payload) => {
            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("name")
              .eq("id", payload.new.sender_id)
              .single();

            setMessages((prev) => [
              ...prev,
              {
                ...payload.new,
                sender: { name: senderProfile?.name },
              },
            ]);
          }
        )
        .subscribe();
    };

    getData();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
  if (!input.trim() || sending) return;

  // ✅ OPTIMISTIC UPDATE - Show message immediately!
  const newMessage = {
    id: Date.now(),
    sender_id: user.id,
    content: input.trim(),
    created_at: new Date().toISOString(),
    sender: { name: profile?.name },
  };

  setMessages((prev) => [...prev, newMessage]);
  setInput("");
  setSending(true);

  try {
    // Save to database
    const { data } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        receiver_id: null,
        content: input.trim(),
      })
      .select()
      .single();

    // Replace temporary message with real database message
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === newMessage.id 
          ? { ...data, sender: { name: profile?.name } } 
          : msg
      )
    );
  } catch (error) {
    console.error("Error sending message:", error);
    // Remove message if it failed
    setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
  } finally {
    setSending(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[620px] bg-gradient-to-br from-emerald-50 to-teal-50 mt-[30px]">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 lg:py-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center text-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Global Chat</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Learn together with Filipino students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Be the first to say something!
              </p>
              <p className="text-sm text-gray-500">
                Start the conversation and inspire your fellow students 🚀
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => {
                const isMe = message.sender_id === user?.id;
                const sentTime = new Date(message.created_at);
                const timeStr = sentTime.toLocaleTimeString("en-PH", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={i}
                    className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    {!isMe && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                        {message.sender?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className={`max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      {!isMe && (
                        <p className="text-xs text-gray-600 font-semibold mb-1 ml-2">
                          {message.sender?.name}
                        </p>
                      )}

                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words shadow-sm transition-all hover:shadow-md
                          ${
                            isMe
                              ? "bg-emerald-500 text-white rounded-br-none"
                              : "bg-white border border-gray-200 text-gray-700 rounded-bl-none"
                          }`}
                      >
                        {message.content}
                      </div>

                      <p className={`text-xs text-gray-500 mt-1 ${isMe ? "text-right mr-2" : "text-left ml-2"}`}>
                        {timeStr}
                      </p>
                    </div>

                    {isMe && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                        {profile?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-gray-100 px-4 lg:px-8 py-4 lg:py-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Share your thoughts with the community..."
              disabled={sending}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-50 resize-none"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white px-4 lg:px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 transform duration-200"
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
          <p className="text-xs text-gray-500 mt-2">Press Enter to send • Be respectful and kind 💚</p>
        </div>
      </div>
    </div>
  );
}