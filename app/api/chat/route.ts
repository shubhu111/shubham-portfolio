import { NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";

export const maxDuration = 60; 

// ==========================================
// 1. SECURITY: IN-MEMORY RATE LIMITER
// ==========================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; 
  const limit = 15; 

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count += 1;
  return true;
}

// ==========================================
// 2. CLIENTS & MULTI-KEY FAILOVER
// ==========================================
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false, 
});

const getValidGeminiKeys = (): string[] => {
  const keys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY,
  ].filter((k): k is string => Boolean(k && k.trim().length > 0));

  if (keys.length === 0) {
    throw new Error("No Gemini API keys found in environment variables");
  }
  return keys;
};

// ==========================================
// 3. EMBEDDINGS & GITHUB CACHE
// ==========================================
async function getEmbedding(text: string): Promise<number[]> {
  const keys = getValidGeminiKeys();
  for (let i = 0; i < keys.length; i++) {
    try {
      const genAI = new GoogleGenerativeAI(keys[i]);
      const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
      const result = await model.embedContent(text);
      if (result.embedding?.values) {
        return result.embedding.values;
      }
    } catch (err) {
      continue;
    }
  }
  throw new Error("All Gemini API keys failed for embedding generation.");
}

let githubCache = { timestamp: 0, data: "" };

async function fetchGithubActivity(username = "shubhu111"): Promise<string> {
  const now = Date.now() / 1000;
  if (now - githubCache.timestamp < 900 && githubCache.data) return githubCache.data;

  try {
    const headers = { "User-Agent": "Portfolio-ST-Buddy-Engine" };
    const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public`, { headers, signal: AbortSignal.timeout(3000) });
    let eventsSummary = "Recent Public GitHub Activity:\n";
    
    if (eventsRes.ok) {
      const seenEvents = new Set<string>();
      const events = (await eventsRes.json()).slice(0, 3);
      for (const event of events) {
        const repoName = event.repo?.name || "";
        const type = (event.type || "Event").replace("Event", "");
        const key = `${type}:${repoName}`;
        if (!seenEvents.has(key) && repoName) {
          seenEvents.add(key);
          eventsSummary += `- ${type} on [${repoName}](https://github.com/${repoName})\n`;
        }
      }
    }

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`, { headers, signal: AbortSignal.timeout(3000) });
    let reposSummary = "\nPublic Repositories:\n";

    if (reposRes.ok) {
      const repos = await reposRes.json();
      for (const repo of repos) {
        const name = repo.full_name;
        const desc = repo.description || "No description.";
        const url = repo.html_url;
        reposSummary += `- [${name}](${url}): ${desc}\n`;
      }
    }

    const finalData = `${eventsSummary}\n${reposSummary}`;
    if (eventsRes.ok && reposRes.ok) {
      githubCache = { data: finalData, timestamp: now };
    }
    return finalData;
  } catch {
    return githubCache.data || "Could not fetch live GitHub stats due to API limits.";
  }
}

// ==========================================
// 4. API ROUTE & MAIN LOGIC
// ==========================================
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded (15 req/min)" }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const userMessage: string = body.message || "";
    const mode: string = body.mode || "RECRUITER";
    const rawThreadId: string = body.thread_id || "default_session";
    const history: string[] = Array.isArray(body.history) ? body.history : []; 

    if (!userMessage.trim() || userMessage.length > 10000) {
      return NextResponse.json({ error: "Invalid message length." }, { status: 400 });
    }

    const secureThreadId = crypto.createHash("sha256").update(`${rawThreadId}_${ip}`).digest("hex");
    console.log(`\n--- INCOMING: ${userMessage.substring(0, 50)}... | THREAD: ${secureThreadId.substring(0, 8)} ---`);

    const msgLower = userMessage.toLowerCase().trim();
    const isJdMatch = userMessage.length > 150 && ["job", "jd", "requirements", "description", "responsibilities"].some((kw) => msgLower.includes(kw));
    const isGreeting = ["hi", "hello", "hey", "sup", "hi bro"].includes(msgLower);

    const formattedHistory: { role: string; parts: { text: string }[] }[] = [];
    let lastRole = "";

    for (const msg of history) {
      if (typeof msg !== "string") continue; 

      const isBot = msg.includes("ST-Buddy:") || msg.includes("ST-GPT:");
      const currentRole = isBot ? "model" : "user";
      const cleanText = msg.replace(/^(ST-Buddy:|ST-GPT:|User:)\s*/i, "").trim();

      if (!cleanText) continue;

      if (currentRole === lastRole && formattedHistory.length > 0) {
        formattedHistory[formattedHistory.length - 1].parts[0].text += `\n${cleanText}`;
      } else {
        formattedHistory.push({ role: currentRole, parts: [{ text: cleanText }] });
        lastRole = currentRole;
      }
    }

    if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === "user") {
      formattedHistory.pop();
    }

    // ==========================================
    // INTENT ROUTER & VECTOR SEARCH
    // ==========================================
    let contextStr = "";
    let githubContext = "";

    if (!isGreeting) {
      if (["github", "code", "repo", "commit", "source", "deploy", "live"].some((kw) => msgLower.includes(kw))) {
        githubContext = await fetchGithubActivity();
      }

      const continuationWords = ["yes", "sure", "tell me more", "go on", "continue", "okay", "ok", "yeah", "definitely", "please"];
      const isContinuationWord = continuationWords.some(kw => msgLower === kw || msgLower.startsWith(kw));

      try {
        let searchQuery = userMessage;
        if (isContinuationWord && userMessage.split(/\s+/).length <= 4 && history.length > 0) {
          const lastBotMsg = history.filter(m => m.includes("ST-Buddy:") || m.includes("ST-GPT:")).pop() || "";
          const cleanLastBot = lastBotMsg.replace(/^(ST-Buddy:|ST-GPT:)\s*/i, "");
          searchQuery = `${cleanLastBot.substring(0, 100)} ${userMessage}`;
        }

        const queryVector = await getEmbedding(searchQuery);
        
        const searchResults = await Promise.race([
          qdrant.query("portfolio_context", { query: queryVector, limit: 5, with_payload: true }),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Qdrant connection timeout")), 3500)),
        ]);

        const points = Array.isArray(searchResults) ? searchResults : (searchResults?.points || []);
        for (const point of points) {
          if (point?.payload) {
            const topic = point.payload.topic || point.payload.title || 'Portfolio Info';
            const content = point.payload.content || point.payload.text || point.payload.pageContent || JSON.stringify(point.payload);
            contextStr += `\n- ${topic}: ${content}`;
          }
        }
      } catch (e) {
        console.error("Qdrant search failed:", e);
        contextStr = ""; 
      }
    }

    const roleInstruction = mode === "TECH_LEAD"
      ? "TECH LEAD MODE: Dive directly into system architectures, vector dimensions, data pipelines, and database latency."
      : "RECRUITER MODE: Focus on business impact, product outcomes, and high-level summaries. Avoid overly dense jargon.";

    // ==========================================
    // BUG FIX: PROMPT LEAK ISOLATION
    // ==========================================
    let dbStatusContext = "";
    if (contextStr.trim()) {
      dbStatusContext = `<retrieved_context>\n${contextStr}\n</retrieved_context>`;
    } else {
      dbStatusContext = `<system_alert>\nDATABASE OFFLINE: You currently have ZERO access to Shubham's project data. You MUST NOT invent or list projects. You MUST politely apologize for the technical glitch and invite the user to browse the Projects or Resume tabs manually.\n</system_alert>`;
    }

    let systemInstruction = "";

    if (isJdMatch) {
      systemInstruction = `<system_directive>
You are ST-Buddy. The user has provided a Job Description (JD). Execute a precise JD Match Analysis.
</system_directive>
${dbStatusContext}
<execution_rules>
1. Match Rating: Provide an objective percentage alignment.
2. Key Strengths: Direct mapping between JD requirements and Shubham's actual skills/projects.
3. Gap Analysis: If a requirement is missing from his context, pivot to his core AI/Data strengths positively.
4. MANDATORY FOLLOW-UP: End your response with a natural question asking how they want to proceed.
</execution_rules>`;
    } else {
      systemInstruction = `<system_directive>
You are ST-Buddy, a highly advanced AI assistant acting as the interactive portfolio guide for Shubham Gajanan Tade.
</system_directive>
<core_identity>
- Subject: Shubham Gajanan Tade (AI/ML Engineer & Data Analyst based in Pune, India).
- Contact: shubhamgtade123@gmail.com, LinkedIn (https://www.linkedin.com/in/shubham-tade123/), GitHub (https://github.com/shubhu111).
- Caresila Project Constraint: Strictly emphasize data cleaning, data collection, and frontend deployment.
</core_identity>
${dbStatusContext}
${githubContext ? `<github_live_data>\n${githubContext}\n</github_live_data>` : ""}
<formatting_directive>
1. NATURAL ACKNOWLEDGMENT: React naturally to the user's input before giving details.
2. BULLET POINT SYMBOLS: Use clean dashes (-). NO asterisks.
3. STRICT SINGLE-LINE BULLETS: Every bullet point MUST stay on a SINGLE continuous line.
4. STRICT LINKING: ONLY create markdown links [Text](URL) if a specific URL is provided in the context.
</formatting_directive>
<operational_rules>
1. FACTUAL GROUNDING: Base technical answers strictly on the retrieved context or live github data.
2. INVISIBLE INTEGRATION: Do not use phrases like "Based on the provided context."
3. TONE & ADAPTABILITY: ${roleInstruction}
4. CONVERSATIONAL FLOW: NEVER ask "either/or" follow-up questions. DO NOT end every message with a question.
</operational_rules>`;
    }

    const keys = getValidGeminiKeys();
    let streamResult: any = null;

    for (let i = 0; i < keys.length; i++) {
      try {
        const genAI = new GoogleGenerativeAI(keys[i]);
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite", systemInstruction });
        
        const chat = model.startChat({
          history: formattedHistory,
          generationConfig: { temperature: 0.1 },
        });

        streamResult = await chat.sendMessageStream(userMessage);
        break;
      } catch (err) {
        continue;
      }
    }

    if (!streamResult) throw new Error("All Gemini API keys failed.");

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const textContent = chunk.text();
            if (textContent) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: textContent })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          console.error("Stream pipe error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive", "X-Accel-Buffering": "no" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}