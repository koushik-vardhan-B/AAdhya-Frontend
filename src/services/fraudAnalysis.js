// src/services/fraudAnalysis.js
// ─── Claude AI Fraud Detection Service ───────────────────

const SYSTEM_PROMPT = `You are an AI fraud detection expert specializing in protecting rural Indian citizens from digital scams. Analyze the given SMS/message and return ONLY a valid JSON object with this exact structure:

{
  "score": <number 0-100>,
  "risk": <"Safe" | "Suspicious" | "High Risk">,
  "fraudType": <"UPI Fraud" | "Job Scam" | "Lottery Scam" | "Phishing" | "Impersonation" | "Other" | "None">,
  "suspiciousKeywords": [<array of suspicious words/phrases found in message>],
  "explanation": "<2-3 sentences explaining why this message is risky or safe>",
  "explanationTe": "<same explanation in simple Telugu>",
  "redFlags": [<array of specific red flags, empty if safe>],
  "redFlagsTe": [<same red flags in simple Telugu>],
  "tips": [<3 actionable safety tips in English>],
  "tipsTe": [<same 3 tips in simple Telugu>],
  "isScam": <true | false>
}

Rules:
- score 0-30 = Safe, 31-65 = Suspicious, 66-100 = High Risk
- Be especially sensitive to: UPI payment requests, OTP requests, lottery wins, job offers with upfront fees, impersonation of banks/government
- suspiciousKeywords must be exact words/phrases from the message
- Telugu translations must be simple and understandable for rural users
- Return ONLY the JSON, no extra text`;

export const analyzeMessage = async (message) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Analyze this message: "${message}"` }],
    }),
  });

  if (!response.ok) throw new Error('API request failed');

  const data = await response.json();
  const text = data.content?.map((b) => b.text || '').join('') || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};
