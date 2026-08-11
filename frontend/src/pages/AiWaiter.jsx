import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";


// ─────────────────────────────────────────────────────────────────────────────
// Constants — Vite proxy forwards /api → http://localhost:8080
// ─────────────────────────────────────────────────────────────────────────────
const AI_BASE = "/api/ai/v1";



// ─────────────────────────────────────────────────────────────────────────────
// Web Speech API TTS helper
// ─────────────────────────────────────────────────────────────────────────────
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AiWaiter() {
  const [tableId, setTableId] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [messages, setMessages] = useState([]); // conversation history
  const [inputText, setInputText] = useState("");
  const [dishes, setDishes] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "menu"

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Build history array for backend (only role+content pairs)
  const getHistory = (msgs) =>
    msgs.map((m) => ({ role: m.role, content: m.content }));

  // ── Send a text message to backend ────────────────────────────────────────
  const sendMessage = useCallback(
    async (userText, mode = "chat") => {
      if (!userText.trim() || !tableId) return;

      const userMsg = { role: "user", content: userText, id: Date.now() };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInputText("");
      setIsLoading(true);
      setPendingAction(null);

      try {
        const res = await fetch(`${AI_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableId: parseInt(tableId),
            userMessage: userText,
            history: getHistory(messages),
            inputMode: mode,
          }),
        });

        const data = await res.json();

        const isSuccess = data.success ?? data.SUCCESS;
        const msgText = data.message ?? data.MESSAGE;
        const aiData = data.data ?? data.DATA;

        if (!res.ok || !isSuccess) {
          throw new Error(msgText || "AI service error");
        }

        const assistantMsg = {
          role: "assistant",
          content: aiData?.replyText || "Here are your recommendations.",
          id: Date.now() + 1,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setDishes(aiData.recommendedDishes || []);

        if (aiData.pendingAction) {
          setPendingAction(aiData.pendingAction);
          setActiveTab("menu");
        }

        if (aiData.recommendedDishes?.length > 0) {
          setActiveTab("menu");
        }

        // TTS — speak the reply
        setIsSpeaking(true);
        speak(aiData.replyText);
        setTimeout(() => setIsSpeaking(false), 3000);
      } catch (err) {
        toast.error(err.message || "Failed to reach AI. Please try again.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I'm having trouble right now. Please try again in a moment.",
            id: Date.now() + 2,
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, tableId]
  );

  // ── Voice recording via Web Speech Recognition API ───────────────────────
  const recognitionRef = useRef(null);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          toast.error("Voice error: " + event.error);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      toast.error("Could not start microphone");
      setIsRecording(false);
    }
  };

  // ── Confirm Order ─────────────────────────────────────────────────────────
  const confirmOrder = async () => {
    if (!pendingAction?.confirmToken) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${AI_BASE}/confirm-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: parseInt(tableId),
          confirmToken: pendingAction.confirmToken,
          items: [],
        }),
      });

      const data = await res.json();
      const isSuccess = data.success ?? data.SUCCESS;
      const msgText = data.message ?? data.MESSAGE;

      if (!res.ok || !isSuccess) {
        throw new Error(msgText || "Failed to place order");
      }

      toast.success("🎉 Order placed successfully!");
      speak("Your order has been placed! Enjoy your meal.");
      setPendingAction(null);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "✅ Your order has been placed! Our kitchen has received it. Enjoy your meal! 🍽️",
          id: Date.now(),
        },
      ]);
      setDishes([]);
      setActiveTab("chat");
    } catch (err) {
      toast.error(err.message || "Could not place order");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Session Start Screen ──────────────────────────────────────────────────
  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl mb-4">
              <span className="text-4xl">🤖</span>
            </div>
            <h1 className="text-4xl font-bold text-white mt-4">AI Waiter</h1>
            <p className="text-purple-300 mt-2 text-lg">Your smart ordering assistant</p>
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-white text-xl font-semibold mb-2">Welcome! 👋</h2>
            <p className="text-purple-200 text-sm mb-6">
              Enter your table number to start ordering with AI
            </p>

            <label className="block text-purple-200 text-sm font-medium mb-2">
              Table Number
            </label>
            <input
              type="number"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tableId && setSessionStarted(true)}
              placeholder="e.g. 1"
              className="w-full px-4 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-purple-300 text-lg text-center focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white/25 transition-all"
            />

            <button
              onClick={() => tableId && setSessionStarted(true)}
              disabled={!tableId}
              className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              Start Ordering 🚀
            </button>

            <div className="mt-6 flex items-center gap-3 text-purple-300 text-xs">
              <span className="flex-1 h-px bg-white/20" />
              <span>Supports voice & text</span>
              <span className="flex-1 h-px bg-white/20" />
            </div>

            <div className="mt-4 flex justify-center gap-6 text-purple-300 text-xs">
              <span>🎤 Voice</span>
              <span>💬 Chat</span>
              <span>🍽️ Smart Menu</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main AI Waiter UI ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl shadow">
            🤖
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">AI Waiter</h1>
            <p className="text-purple-300 text-xs">Table {tableId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <span className="flex gap-1 items-center">
              {[0, 100, 200].map((d) => (
                <span
                  key={d}
                  className="w-1 bg-violet-400 rounded-full animate-bounce"
                  style={{ height: "12px", animationDelay: `${d}ms` }}
                />
              ))}
            </span>
          )}
          <button
            onClick={() => { setSessionStarted(false); setMessages([]); setDishes([]); setPendingAction(null); }}
            className="px-3 py-1.5 rounded-xl bg-white/10 text-purple-200 text-xs border border-white/20 hover:bg-white/20 transition"
          >
            Change Table
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-2 bg-white/5 border-b border-white/10">
        {["chat", "menu"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow"
                : "text-purple-300 hover:bg-white/10"
            }`}
          >
            {tab === "chat" ? "💬 Chat" : `🍽️ Menu${dishes.length > 0 ? ` (${dishes.length})` : ""}`}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex flex-col">

        {/* ── CHAT TAB ── */}
        {activeTab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👋</div>
                  <p className="text-white text-xl font-semibold">Hello! I'm your AI Waiter</p>
                  <p className="text-purple-300 mt-2 text-sm">
                    Tell me what you'd like to eat or ask about our menu
                  </p>
                  <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto">
                    {[
                      "What vegetarian dishes do you have?",
                      "I want something spicy under ₹300",
                      "Show me today's specials",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-purple-200 text-sm hover:bg-white/20 transition text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-br-md"
                        : msg.isError
                        ? "bg-red-500/20 border border-red-400/30 text-red-200 rounded-bl-md"
                        : "bg-white/10 border border-white/20 text-white rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm mr-2 flex-shrink-0">
                    🤖
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 150, 300].map((d) => (
                        <span
                          key={d}
                          className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* ── Confirm Order Banner ── */}
            {pendingAction && (
              <div className="mx-4 mb-3 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 font-semibold text-sm">Ready to order?</p>
                    <p className="text-green-200 text-xs mt-0.5">
                      {pendingAction.items?.length} item(s) • Tap to confirm
                    </p>
                  </div>
                  <button
                    onClick={confirmOrder}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm shadow-lg hover:from-green-600 hover:to-emerald-600 transition active:scale-95 disabled:opacity-60"
                  >
                    {isLoading ? "Placing..." : "Place Order ✅"}
                  </button>
                </div>
              </div>
            )}

            {/* ── Input Row ── */}
            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2 items-end">
              <div className="flex-1 flex items-end gap-2 bg-white/10 border border-white/20 rounded-2xl px-3 py-2">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(inputText);
                    }
                  }}
                  placeholder="Type a message or use mic..."
                  rows={1}
                  className="flex-1 bg-transparent text-white placeholder-purple-400 text-sm resize-none focus:outline-none min-h-[24px] max-h-[80px]"
                  style={{ overflowY: "auto" }}
                />
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim() || isLoading}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 hover:from-violet-600 hover:to-purple-700 transition disabled:opacity-40"
                >
                  ➤
                </button>
              </div>

              {/* Voice button */}
              <button
                onClick={toggleRecording}
                disabled={isLoading}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 transition-all active:scale-90 ${
                  isRecording
                    ? "bg-red-500 shadow-lg shadow-red-500/50 animate-pulse"
                    : "bg-white/10 border border-white/20 hover:bg-white/20"
                }`}
                title={isRecording ? "Click to stop listening" : "Click to speak"}
              >
                {isRecording ? "🔴" : "🎤"}
              </button>
            </div>
          </>
        )}

        {/* ── MENU TAB ── */}
        {activeTab === "menu" && (
          <div className="flex-1 overflow-y-auto p-4">
            {dishes.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-white text-lg font-semibold">No recommendations yet</p>
                <p className="text-purple-300 text-sm mt-2">
                  Chat with the AI to discover dishes
                </p>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition"
                >
                  Start chatting 💬
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-white font-bold text-lg mb-4">
                  🍽️ Recommendations ({dishes.length})
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {dishes.map((dish) => (
                    <div
                      key={dish.dishId}
                      className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition"
                    >
                      <div className="flex gap-4 p-4">
                        {dish.imageUrl ? (
                          <img
                            src={dish.imageUrl}
                            alt={dish.dishName}
                            className="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-white/10"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="w-24 h-24 rounded-xl bg-white/10 flex-shrink-0 items-center justify-center text-4xl"
                          style={{ display: dish.imageUrl ? "none" : "flex" }}
                        >
                          🍽️
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-base truncate">
                            {dish.dishName}
                          </h3>
                          {dish.description && (
                            <p className="text-purple-300 text-xs mt-1 line-clamp-2">
                              {dish.description}
                            </p>
                          )}
                          {dish.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dish.tags.split(",").map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-violet-500/30 border border-violet-400/30 text-violet-200 rounded-full text-xs"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-green-400 font-bold text-lg mt-2">
                            ₹{dish.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pendingAction && (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40">
                    <p className="text-green-300 font-bold text-base mb-1">
                      ✅ Ready to place your order
                    </p>
                    <p className="text-green-200 text-sm mb-4">
                      {pendingAction.items?.length} item(s) selected. This will expire in 5 minutes.
                    </p>
                    <button
                      onClick={confirmOrder}
                      disabled={isLoading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-base shadow-lg hover:from-green-600 hover:to-emerald-600 transition active:scale-95 disabled:opacity-60"
                    >
                      {isLoading ? "Placing your order..." : "🍽️ Confirm & Place Order"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
