import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import gsap from "gsap";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const MOCK_RESPONSES: Record<string, string> = {
  hello: "Hello! 👋 I'm Vera, your virtual guide to Veritas Institute. How can I help you today?",
  hi: "Hi there! 👋 Welcome to Veritas Institute. What would you like to know?",
  admission: "Great question! Our application periods are:\n\n• **Early Decision**: November 1\n• **Regular Decision**: January 15\n• **Rolling Admissions**: March 1 – May 30\n\nYou'll need transcripts, test scores, a personal statement, and recommendation letters. The application fee is $75. Would you like to know more?",
  tuition: "Here's a breakdown of our annual costs:\n\n• **Undergraduate**: $52,000\n• **Graduate**: $38,000–$58,000\n• **Room & Board**: $16,500\n\n92% of students receive financial aid, with an average scholarship of $28,000! 🎓",
  scholarship: "We're committed to making education accessible! 92% of our students receive some form of financial aid. The average scholarship is $28,000. Contact finaid@veritas.edu for personalized information.",
  program: "Veritas offers 143+ degree programs across 10 colleges including Arts & Sciences, Engineering, Business, Medicine, Law, and more! Our student-to-faculty ratio is an impressive 12:1. What field interests you?",
  research: "Research is at our core! With $450M+ in annual funding, we have centers of excellence in AI, biotechnology, sustainable energy, and public policy. We also have 200+ active industry partnerships. 🔬",
  campus: "Our beautiful 320-acre campus features 45 academic buildings, 12 research centers, 8 libraries, a sports complex, and 15 residence halls. We'd love for you to visit! 🏛️",
  contact: "You can reach us at:\n\n• **Main Office**: +1 (555) 123-4567\n• **Admissions**: admissions@veritas.edu\n• **Financial Aid**: finaid@veritas.edu\n• **Address**: 1 Veritas Way, Academic City, ST 10001",
};

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return "Thank you for your question! I'm currently running in offline mode. Once connected to our AI backend, I'll be able to answer all your questions about Veritas Institute in detail. In the meantime, feel free to ask about admissions, tuition, programs, research, campus life, or contact info! 😊";
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! 👋 I'm **Vera**, your virtual assistant for Veritas Institute. Ask me anything about admissions, programs, campus life, and more!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatRef.current) {
      if (isOpen) {
        gsap.fromTo(
          chatRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
        );
      }
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate delay for mock responses
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

    const botResponse = getMockResponse(userMessage.text);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="absolute bottom-16 right-0 w-[360px] sm:w-96 h-[520px] rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-accent text-accent-foreground">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold tracking-wide">Vera</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[11px] opacity-80">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-accent-foreground/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-accent" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-accent text-accent-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.text.split("\n").map((line, i) => (
                    <span key={i}>
                      {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={j}>{part.slice(2, -2)}</strong>
                        ) : (
                          part
                        )
                      )}
                      {i < msg.text.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={14} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-accent" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border/40">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Vera anything..."
                className="flex-1 bg-secondary/60 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/50"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-colors disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default ChatBot;
