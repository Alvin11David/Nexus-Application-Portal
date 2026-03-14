import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import LoginOwl3D from "@/components/LoginOwl3D";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSad, setIsSad] = useState(false);
  const [errorPulse, setErrorPulse] = useState(0);
  const headlineTopFull = "Welcome to the";
  const headlineBottomFull = "Admin Portal";
  const descriptionFull =
    "Manage your institution's content, faculty, courses, and news - all from one place.";
  const [typedHeadlineTop, setTypedHeadlineTop] = useState("");
  const [typedHeadlineBottom, setTypedHeadlineBottom] = useState("");
  const [typedDescription, setTypedDescription] = useState("");
  const [typingStage, setTypingStage] = useState<
    "top" | "bottom" | "description" | "done"
  >("top");
  const navigate = useNavigate();
  const { toast } = useToast();

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const mouseRafRef = useRef<number>();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const cardRafRef = useRef<number>();
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const el = leftPanelRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (typeof mouseRafRef.current === "number") {
        window.cancelAnimationFrame(mouseRafRef.current);
      }
      mouseRafRef.current = window.requestAnimationFrame(() =>
        setMouse({ x, y }),
      );
    };
    const handleMouseLeave = () => {
      if (typeof mouseRafRef.current === "number") {
        window.cancelAnimationFrame(mouseRafRef.current);
      }
      mouseRafRef.current = window.requestAnimationFrame(() =>
        setMouse({ x: 0, y: 0 }),
      );
    };
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (typeof mouseRafRef.current === "number") {
        window.cancelAnimationFrame(mouseRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timeoutIds: number[] = [];
    const intervalIds: number[] = [];

    const startTyping = (
      text: string,
      setter: React.Dispatch<React.SetStateAction<string>>,
      speed: number,
      onDone?: () => void,
    ) => {
      let index = 0;
      const intervalId = window.setInterval(() => {
        index += 1;
        setter(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(intervalId);
          onDone?.();
        }
      }, speed);
      intervalIds.push(intervalId);
    };

    const startId = window.setTimeout(() => {
      setTypingStage("top");
      startTyping(headlineTopFull, setTypedHeadlineTop, 52, () => {
        const nextTopPause = window.setTimeout(() => {
          setTypingStage("bottom");
          startTyping(headlineBottomFull, setTypedHeadlineBottom, 68, () => {
            const nextBottomPause = window.setTimeout(() => {
              setTypingStage("description");
              startTyping(descriptionFull, setTypedDescription, 18, () => {
                setTypingStage("done");
              });
            }, 260);
            timeoutIds.push(nextBottomPause);
          });
        }, 230);
        timeoutIds.push(nextTopPause);
      });
    }, 320);
    timeoutIds.push(startId);

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
      intervalIds.forEach((id) => window.clearInterval(id));
    };
  }, []);

  const triggerSadReaction = useCallback(() => {
    setIsSad(true);
    setErrorPulse((prev) => prev + 1);
    setTimeout(() => setIsSad(false), 2500);
  }, []);

  const handleFocus = useCallback(() => {
    setIsTyping(true);
    setIsSad(false);
  }, []);
  const handleBlur = useCallback(() => setIsTyping(false), []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      triggerSadReaction();
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      triggerSadReaction();
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    setOauthLoading(provider);
    const { error } = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + "/admin",
    });
    if (error) {
      triggerSadReaction();
      toast({
        title: `${provider === "google" ? "Google" : "Apple"} login failed`,
        description: String(error),
        variant: "destructive",
      });
    }
    setOauthLoading(null);
  };

  return (
    <div className="min-h-screen flex font-[family-name:var(--font-body)]">
      {/* Left decorative panel */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0d1b2e] via-[#122140] to-[#0a1628] relative overflow-hidden flex-col justify-between p-12"
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gold orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[28rem] h-[28rem] rounded-full bg-[#c9a84c]/10 blur-3xl -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#c9a84c]/8 blur-3xl translate-x-1/4 translate-y-1/4" />
          <div className="absolute left-1/2 top-1/2 w-96 h-40 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#b8860b]/12 blur-3xl" />
        </div>

        <div
          className="relative z-10 transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 4}px, 0)`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-[#e0b84c]" />
            <span className="text-white/90 text-lg font-semibold tracking-[0.28em] uppercase">
              VERITAS
            </span>
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-[#c9a84c] to-transparent mt-1" />
        </div>

        <div style={{ perspective: "900px" }} className="relative z-10">
          <div
            ref={cardRef}
            className="space-y-6 rounded-3xl border border-[#c9a84c]/20 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent backdrop-blur-sm px-8 py-9 shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform"
            style={{
              transform: cardTilt.active
                ? `translate3d(${mouse.x * 14}px, ${mouse.y * 10}px, 0) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale3d(1.025,1.025,1)`
                : `translate3d(${mouse.x * 14}px, ${mouse.y * 10}px, 0) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`,
              boxShadow: cardTilt.active
                ? "0 32px_100px_rgba(0,0,0,0.55), 0 0 40px rgba(201,168,76,0.12)"
                : "0 24px 80px rgba(0,0,0,0.45)",
            }}
            onMouseMove={(e) => {
              const el = cardRef.current;
              if (!el) return;
              const rect = el.getBoundingClientRect();
              const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
              const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
              if (typeof cardRafRef.current === "number")
                window.cancelAnimationFrame(cardRafRef.current);
              cardRafRef.current = window.requestAnimationFrame(() =>
                setCardTilt({ x: -ny * 9, y: nx * 12, active: true }),
              );
            }}
            onMouseLeave={() => {
              if (typeof cardRafRef.current === "number")
                window.cancelAnimationFrame(cardRafRef.current);
              cardRafRef.current = window.requestAnimationFrame(() =>
                setCardTilt({ x: 0, y: 0, active: false }),
              );
            }}
          >
            <div className="absolute -left-6 top-6 h-28 w-28 rounded-full bg-[#c9a84c]/25 blur-3xl animate-pulse" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-[#c9a84c]/15" />

            <h2 className="relative text-4xl xl:text-5xl font-[family-name:var(--font-heading)] text-primary-foreground leading-tight min-h-[6.5rem]">
              <span
                className="inline-block text-white drop-shadow-[0_0_28px_rgba(201,168,76,0.35)] transition-transform duration-300 ease-out"
                style={{
                  transform: `translate3d(${mouse.x * -8}px, ${mouse.y * -6}px, 0)`,
                }}
              >
                {typedHeadlineTop}
                {typingStage === "top" && (
                  <span className="ml-1 inline-block w-[2px] h-[0.95em] bg-accent align-[-0.1em] animate-pulse" />
                )}
              </span>
              <br />
              <span
                className="inline-block italic bg-gradient-to-r from-[#c9a84c] via-[#f5d78a] to-[#b8860b] bg-clip-text text-transparent bg-[length:200%_100%] animate-[pulse_2.2s_ease-in-out_infinite] drop-shadow-[0_0_30px_rgba(201,168,76,0.5)] transition-transform duration-300 ease-out"
                style={{
                  transform: `translate3d(${mouse.x * -14}px, ${mouse.y * -10}px, 0)`,
                }}
              >
                {typedHeadlineBottom}
                {typingStage === "bottom" && (
                  <span className="ml-1 inline-block w-[2px] h-[0.95em] bg-[#c9a84c] align-[-0.1em] animate-pulse" />
                )}
              </span>
            </h2>

            <p
              className="relative text-white/70 text-lg max-w-md leading-relaxed min-h-[5.25rem] transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(${mouse.x * -5}px, ${mouse.y * -4}px, 0)`,
              }}
            >
              {typedDescription}
              {typingStage === "description" && (
                <span className="ml-1 inline-block w-[2px] h-[1em] bg-[#c9a84c]/80 align-[-0.1em] animate-pulse" />
              )}
              {typingStage === "done" && (
                <span className="absolute -left-1 -top-1 text-[#c9a84c]/70">
                  ✦
                </span>
              )}
            </p>
          </div>
        </div>
        {/* /perspective wrapper */}

        <p
          className="relative z-10 text-white/35 text-sm transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mouse.x * 5}px, ${mouse.y * 3}px, 0)`,
          }}
        >
          © {new Date().getFullYear()} Veritas Institute. All rights reserved.
        </p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Back link */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to website
          </a>

          {/* 3D Owl */}
          <div className="flex justify-center">
            <Suspense
              fallback={
                <div className="w-full h-48 sm:h-56 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <LoginOwl3D
                isTyping={isTyping}
                isSad={isSad}
                errorPulse={errorPulse}
              />
            </Suspense>
          </div>

          {/* Header */}
          <div className="text-center space-y-1">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-foreground text-sm font-semibold tracking-wide">
                VERITAS
              </span>
            </div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
              Sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@veritas.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="pl-10 h-12 rounded-xl bg-muted/30 border-border focus:bg-background transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="pl-10 pr-10 h-12 rounded-xl bg-muted/30 border-border focus:bg-background transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-medium"
              disabled={loading || !!oauthLoading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground tracking-widest">
                or
              </span>
            </div>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-border hover:bg-muted/50 transition-all"
              onClick={() => handleOAuthLogin("google")}
              disabled={!!oauthLoading || loading}
            >
              {oauthLoading === "google" ? (
                <span className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span className="ml-2 text-sm font-medium">Google</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-border hover:bg-muted/50 transition-all"
              onClick={() => handleOAuthLogin("apple")}
              disabled={!!oauthLoading || loading}
            >
              {oauthLoading === "apple" ? (
                <span className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              )}
              <span className="ml-2 text-sm font-medium">Apple</span>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-2">
            Protected area · Only authorized administrators can access this
            portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
