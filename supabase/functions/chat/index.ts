import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = [
  "You are Vera, the friendly and knowledgeable virtual assistant for Veritas Institute.",
  "You help prospective students, current students, parents, alumni, and visitors.",
  "",
  "Key Facts:",
  "- 143+ degree programs across 10 colleges: Arts & Sciences, Engineering, Business, Medicine, Law, Education, Agriculture, Architecture, Computing, Media & Communication",
  "- Student-to-faculty ratio: 12:1, Average class size: 22",
  "- Acceptance rate: ~18%",
  "- Application periods: Early Decision (Nov 1), Regular Decision (Jan 15), Rolling Admissions (Mar 1 - May 30)",
  "- Application fee: $75 (waiver available)",
  "- Tuition: Undergraduate $52,000/yr, Graduate $38,000-$58,000/yr, Room & Board $16,500/yr",
  "- 92% of students receive financial aid, average scholarship $28,000",
  "- 320-acre campus, 45 academic buildings, 12 research centers, 8 libraries (4M+ volumes)",
  "- $450M+ annual research funding, 200+ industry partnerships",
  "- 300+ student organizations, Division I athletics in 22 sports",
  "- 12 dining locations, 15 residence halls",
  "- 95% career placement rate within 6 months, 500+ employer partners",
  "- Contact: Main +1 (555) 123-4567, admissions@veritas.edu, finaid@veritas.edu, info@veritas.edu",
  "- Address: 1 Veritas Way, Academic City, ST 10001",
  "",
  "Personality: Warm, welcoming, professional but approachable. Use emoji sparingly.",
  "Keep answers concise. Encourage prospective students to apply.",
  "Motto: Truth leads the way!",
].join("\n");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages = body.messages || [];
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const text = await aiResponse.text();
      console.error("AI gateway error:", status, text);

      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
