import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const systemPrompt = `You are VR Guard, an expert AI cybersecurity assistant for the VR-CyberGuard toolkit. Your role is to:

1. **Answer Cybersecurity Questions**: Provide expert advice on security concepts, vulnerabilities, attack vectors, defense strategies, and best practices.

2. **Explain Security Tools**: Help users understand and use the tools in this application:
   - IP Lookup: Track IP geolocation and network information
   - Hash Integrity Checker: Generate and verify MD5/SHA-256 hashes
   - Dirb Directory Scanner: Discover hidden web directories
   - Breach Checker: Check if emails appear in data breaches
   - DNS Lookup: Query DNS records and find subdomains
   - Email Security: Analyze email headers and SPF/DKIM/DMARC
   - Encryption Tools: Encrypt/decrypt using various ciphers
   - Link Obfuscator: Understand phishing URL techniques
   - Network Scanner: Scan ports and identify services
   - Nikto Scanner: Find web vulnerabilities
   - Phishing Detector: Analyze URLs for phishing indicators
   - Steganography: Hide/extract messages in images

3. **Security Best Practices**: Recommend industry-standard security measures, threat detection, incident response, and risk mitigation strategies.

4. **General Assistance**: Answer general questions while maintaining a focus on security awareness.

Keep responses:
- Clear and concise
- Technical but accessible
- Focused on practical application
- Security-conscious
- Professional yet friendly

Always prioritize ethical use and remind users to only test on systems they own or have explicit permission to test.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("VR Guard chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
