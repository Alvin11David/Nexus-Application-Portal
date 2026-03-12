import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import gsap from "gsap";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const RESPONSES: [string[], string][] = [
  [["hello", "hi", "hey", "greetings"],
    "Hello! 👋 I'm **Vera**, your virtual guide to Veritas Institute. How can I help you today? You can ask about admissions, programs, campus life, athletics, dining, housing, careers, and more!"],
  [["admission", "apply", "application", "enroll"],
    "Great question! Our application periods are:\n\n- **Early Decision**: November 1\n- **Regular Decision**: January 15\n- **Rolling Admissions**: March 1 – May 30\n\nYou'll need transcripts, test scores, a personal statement, and recommendation letters. The application fee is **$75** (waiver available). Our acceptance rate is ~18%.\n\nReady to apply? Visit our How to Apply page!"],
  [["tuition", "cost", "fee", "price", "afford"],
    "Here's a breakdown of annual costs:\n\n- **Undergraduate**: $52,000\n- **Graduate**: $38,000–$58,000\n- **Room & Board**: $16,500\n\n💡 **92% of students** receive financial aid, with an average scholarship of **$28,000**! Contact finaid@veritas.edu for personalized info."],
  [["scholarship", "financial aid", "grant", "merit"],
    "We're committed to making education accessible!\n\n- **92%** of students receive some form of aid\n- Average scholarship: **$28,000**\n- Merit-based, need-based, and athletic scholarships available\n- Work-study programs on campus\n- External scholarship matching service\n\nContact **finaid@veritas.edu** to explore your options! 🎓"],
  [["program", "major", "degree", "course", "academic"],
    "Veritas offers **143+ degree programs** across 10 colleges:\n\n🎨 Arts & Sciences | ⚙️ Engineering | 💼 Business\n🏥 Medicine | ⚖️ Law | 📚 Education\n🌾 Agriculture | 🏗️ Architecture | 💻 Computing\n📺 Media & Communication\n\nOur student-to-faculty ratio is **12:1** with an average class size of just 22 students. What field interests you?"],
  [["research", "lab", "innovation"],
    "Research is at our core! 🔬\n\n- **$450M+** in annual research funding\n- Centers of excellence in **AI, biotechnology, sustainable energy, and public policy**\n- **200+** active industry partnerships\n- Undergraduate research opportunities from freshman year\n- Annual Research Symposium showcasing student work\n\nMany students publish papers before graduation!"],
  [["campus", "building", "facility", "tour", "visit"],
    "Our beautiful **320-acre** campus features:\n\n🏛️ 45 academic buildings\n🔬 12 research centers\n📚 8 libraries (4M+ volumes)\n🏟️ State-of-the-art sports complex\n🏊 Olympic-size aquatic center\n🏠 15 residence halls\n🚌 Free campus shuttle service\n\nWe'd love for you to visit! Schedule a tour through our Visit page."],
  [["student life", "club", "organization", "activity", "social", "event"],
    "Student life at Veritas is vibrant! 🎉\n\n- **300+ student organizations** — from academic societies to cultural clubs\n- Student government with real campus influence\n- Annual traditions: Founders' Week, Spring Fest, Midnight Breakfast\n- Performing arts: theater, dance, a cappella, orchestra\n- Community service: 50+ volunteer programs\n- Greek life with 25+ fraternities and sororities\n- Student-run newspaper, radio station, and TV channel\n\nThere's truly something for everyone!"],
  [["athletic", "sport", "gym", "fitness", "exercise", "team"],
    "Go Veritas Lions! 🦁\n\n**Division I athletics** in 22 sports including:\n- 🏈 Football | 🏀 Basketball | ⚽ Soccer\n- 🏊 Swimming | 🎾 Tennis | 🏃 Track & Field\n- 🏐 Volleyball | ⚾ Baseball | 🥍 Lacrosse\n\n**Facilities:**\n- 45,000-seat stadium\n- Olympic aquatic center\n- 24/7 fitness center with personal training\n- Indoor track and climbing wall\n- Intramural leagues for 15+ sports\n\nWhether varsity or recreational, we've got you covered!"],
  [["dining", "food", "eat", "meal", "restaurant", "cafeteria"],
    "Award-winning dining awaits! 🍽️\n\n**12 dining locations** across campus including:\n- 🥗 Fresh Market — farm-to-table buffet\n- 🍕 The Commons — casual dining hall\n- ☕ Three specialty coffee shops\n- 🌮 International food court (Asian, Mediterranean, Latin)\n- 🥩 The Faculty Club — upscale dining\n- 🧁 Late-night snack bars open until 2am\n\n**Meal plans** from $2,800–$4,200/semester. All locations accommodate dietary restrictions including vegan, gluten-free, halal, and kosher options."],
  [["housing", "dorm", "residence", "room", "living", "accommodation"],
    "Welcome home! 🏠\n\n**15 residence halls** offering:\n- 🛏️ Singles, doubles, and suite-style rooms\n- 🏢 Apartment-style living for upperclassmen\n- 🌿 Living-learning communities by interest\n- 🔒 24/7 security with card access\n- 🧺 In-building laundry (free!)\n- 📶 High-speed WiFi throughout\n\n**Room & Board**: $16,500/year\n\nFirst-years are guaranteed housing! Each hall has resident advisors, study lounges, and common kitchens. Our newest hall, Centennial Tower, opened in 2024 with stunning views! 🏙️"],
  [["career", "job", "employ", "intern", "placement", "hire"],
    "Your future starts here! 💼\n\n**Career Services highlights:**\n- **95% placement rate** within 6 months of graduation\n- Dedicated career counselors for each college\n- **500+ employer partners** recruiting on campus\n- Annual career fairs (Fall & Spring)\n- Mock interviews and résumé workshops\n- **Alumni mentorship** network of 120,000+\n\n**Top employers** hiring our grads: Fortune 500 companies, leading hospitals, top law firms, tech giants, and government agencies.\n\nInternship support begins sophomore year!"],
  [["international", "abroad", "global", "foreign"],
    "Join our global community! 🌍\n\n- Students from **85+ countries**\n- Study abroad in **45+ partner countries**\n- International Student Services office\n- English language support programs\n- Cultural exchange events year-round\n- Visa and immigration assistance\n\nWe celebrate diversity and provide a welcoming environment for all international students!"],
  [["library", "study", "book", "resource"],
    "Our **8 libraries** house over **4 million volumes**! 📚\n\n- 24/7 access during finals\n- Group study rooms (bookable online)\n- Silent study floors\n- Digital resources: 500,000+ e-journals\n- Research librarians for every discipline\n- Rare books and special collections\n- Printing and scanning stations\n\nThe Main Library also has a café on the ground floor! ☕"],
  [["health", "wellness", "counsel", "mental", "doctor", "medical"],
    "Your wellbeing matters! 💚\n\n**Health & Wellness Center:**\n- On-campus medical clinic (no appointment needed)\n- Counseling services with licensed therapists\n- 24/7 crisis hotline\n- Peer support programs\n- Wellness workshops: stress, sleep, nutrition\n- Fitness and mindfulness classes\n- Health insurance plans available\n\nAll services are confidential and included in your student fees."],
  [["contact", "phone", "email", "address", "reach"],
    "You can reach us at:\n\n📞 **Main Office**: +1 (555) 123-4567\n✉️ **Admissions**: admissions@veritas.edu\n💰 **Financial Aid**: finaid@veritas.edu\n📧 **General**: info@veritas.edu\n📍 **Address**: 1 Veritas Way, Academic City, ST 10001\n\nOffice hours: Mon–Fri 8am–6pm, Sat 9am–1pm"],
  [["thank", "thanks", "bye", "goodbye"],
    "You're welcome! 😊 It was great chatting with you. Remember, **Truth leads the way!** Don't hesitate to come back if you have more questions. Good luck! 🎓"],
];

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [keywords, response] of RESPONSES) {
    if (keywords.some((k) => lower.includes(k))) return response;
  }
  return "Great question! I can help with information about **admissions**, **programs**, **tuition**, **scholarships**, **campus life**, **athletics**, **dining**, **housing**, **career services**, **health & wellness**, and **contact info**.\n\nTry asking about any of these topics! 😊";
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! 👋 I'm **Vera**, your virtual assistant for Veritas Institute. Ask me anything about admissions, programs, campus life, athletics, dining, housing, careers, and more!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatRef.current && isOpen) {
      gsap.fromTo(
        chatRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const botContent = getMockResponse(userMsg.content);

    // Simulate typing by streaming characters
    let soFar = "";
    const streamId = "streaming-" + Date.now();
    const chars = botContent.split("");
    
    for (let i = 0; i < chars.length; i += 3) {
      soFar += chars.slice(i, i + 3).join("");
      const snapshot = soFar;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.id === streamId) {
          return prev.map((m, idx) =>
            idx === prev.length - 1 ? { ...m, content: snapshot } : m
          );
        }
        return [...prev, { id: streamId, role: "assistant" as const, content: snapshot }];
      });
      await new Promise((r) => setTimeout(r, 8));
    }

    // Finalize
    setMessages((prev) =>
      prev.map((m) =>
        m.id === streamId ? { ...m, id: Date.now().toString(), content: botContent } : m
      )
    );
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple markdown-like rendering
  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
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
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-accent" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  }`}
                >
                  {renderText(msg.content)}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={14} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default ChatBot;
