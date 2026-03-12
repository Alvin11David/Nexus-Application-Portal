import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Vera, the friendly and knowledgeable virtual assistant for Veritas Institute. You help prospective students, current students, parents, alumni, and visitors with questions about the institute.

## About Veritas Institute
Veritas Institute is a prestigious institution of higher learning committed to academic excellence, groundbreaking research, and holistic student development. Founded with a vision to nurture future leaders, the institute offers over 143 programs across 10 colleges.

## Key Information

### Admissions
- Application periods: Early Decision (Nov 1), Regular Decision (Jan 15), Rolling Admissions (Mar 1 - May 30)
- Required documents: Transcripts, standardized test scores, personal statement, letters of recommendation
- Application fee: $75 (waiver available for qualifying students)
- Acceptance rate: ~18%

### Tuition & Fees (Annual)
- Undergraduate: $52,000
- Graduate: $38,000 - $58,000 depending on program
- Room & Board: $16,500
- Financial aid available: 92% of students receive some form of aid
- Average scholarship: $28,000

### Academics
- 10 Colleges: Arts & Sciences, Engineering, Business, Medicine, Law, Education, Agriculture, Architecture, Computing, Media & Communication
- Student-to-faculty ratio: 12:1
- Average class size: 22 students
- 143+ degree programs
- Study abroad partnerships with 45+ countries

### Campus
- 320-acre main campus
- 45 academic buildings, 12 research centers, 8 libraries with over 4 million volumes
- State-of-the-art sports complex, aquatic center, and fitness facilities
- 15 residence halls
- Campus shuttle service

### Research
- $450M+ annual research funding
- Centers of excellence in AI, biotechnology, sustainable energy, and public policy
- 200+ active research partnerships with industry leaders

### Student Life
- 300+ student organizations
- Division I athletics in 22 sports
- Award-winning dining with 12 dining locations
- Health & wellness center with counseling services
- Career services with 95% placement rate within 6 months of graduation

### Athletics
- Division I in 22 sports: Football, Basketball, Soccer, Swimming, Tennis, Track & Field, Volleyball, Baseball, Lacrosse, and more
- 45,000-seat stadium, Olympic aquatic center, 24/7 fitness center
- Intramural leagues for 15+ sports

### Dining
- 12 dining locations including farm-to-table, international food court, specialty coffee shops, and late-night options
- All locations accommodate dietary restrictions (vegan, gluten-free, halal, kosher)
- Meal plans from $2,800-$4,200/semester

### Housing
- 15 residence halls with singles, doubles, suites, and apartments
- Living-learning communities, 24/7 security, free laundry, high-speed WiFi
- Room & Board: $16,500/year. First-years guaranteed housing.

### Career Services
- 95% placement rate within 6 months
- 500+ employer partners, annual career fairs
- Mock interviews, resume workshops, alumni mentorship network of 120,000+

### Contact
- Main Office: +1 (555) 123-4567
- Admissions: admissions@veritas.edu
- Financial Aid: finaid@veritas.edu
- General Inquiries: info@veritas.edu
- Address: 1 Veritas Way, Academic City, ST 10001

## Your Personality
- Warm, welcoming, and enthusiastic about Veritas
- Professional but approachable
- Use emoji sparingly for friendliness
- Keep answers concise but thorough
- If you don't know something specific, suggest contacting the relevant department
- Always encourage prospective students to apply
- Sign off important messages with "Truth leads the way!" (Veritas motto)
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
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

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
