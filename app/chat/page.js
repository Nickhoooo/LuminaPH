"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function GlobalChat() {
  const router = useRouter();
  const bottomRef = useRef(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let subscription = null;

    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profile);

      const { data: existingMessages } = await supabase
        .from("messages")
        .select("*, sender:profiles!messages_sender_id_fkey(name)")
        .is("receiver_id", null)
        .order("created_at", { ascending: true });

      setMessages(existingMessages || []);
      setLoading(false);

      // Isang subscription lang!
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

            setMessages((prev) => [...prev, {
              ...payload.new,
              profiles: senderProfile,
            }]);
          }
        )
        .subscribe((status) => {
          console.log("Chat status:", status);
        });
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
  setSending(true);

  try {
    await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        receiver_id: null,
        content: input.trim(),
      });

    setInput("");

    const { data: updatedMessages, error } = await supabase
      .from("messages")
      .select("*, sender:profiles!messages_sender_id_fkey(name)")
      .is("receiver_id", null)
      .order("created_at", { ascending: true });

    console.log("Updated messages:", updatedMessages); // ← dagdag mo ito
    console.log("Fetch error:", error); // ← dagdag mo ito

    setMessages(updatedMessages || []);

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

      <nav className="bg-white border-b border-gray-100 px-10 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="font-serif text-xl cursor-pointer">
            Lumina<span className="text-orange-500">PH</span>
          </div>
        </Link>
        <div className="text-sm font-medium text-gray-600">
          💬 Global Chat
        </div>
        <Link href="/dashboard">
          <button className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            ← Back
          </button>
        </Link>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <span className="text-4xl mb-3">💬</span>
            <p className="text-sm text-gray-400">
              Wala pang messages — maging una! 😄
            </p>
          </div>
        ) : (
          messages.map((message, i) => {
            const isMe = message.sender_id === user?.id;
            return (
              <div key={i} className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-medium text-orange-500 mr-3 mt-1">
                    {message.sender?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="max-w-lg">
                  {!isMe && (
                    <p className="text-xs text-gray-400 mb-1 ml-1">
                      {message.sender?.name}
                    </p>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${isMe
                      ? "bg-orange-400 text-white rounded-tr-none"
                      : "bg-white border border-gray-100 text-gray-700 rounded-tl-none"
                    }`}>
                    {message.content}
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>
                    {new Date(message.created_at).toLocaleTimeString("en-PH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {isMe && (
                  <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-xs font-medium text-white ml-3 mt-1">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Mag-type ng message..."
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