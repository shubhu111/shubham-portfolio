import { NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAI } from "@google/generative-ai";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const collectionName = "portfolio_context";

    // 1. Handle Deletion Event from Sanity
    if (body._type === "delete" || req.headers.get("x-sanity-event") === "delete") {
      await qdrant.delete(collectionName, {
        points: [body._id],
      });
      return NextResponse.json({ success: true, message: "Vector removed from Qdrant." });
    }

    // 2. Ignore non-agentContext documents
    if (body._type !== "agentContext") {
      return NextResponse.json({ message: "Document type ignored" }, { status: 200 });
    }

    const { _id, topic, category, content } = body;

    if (!topic || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Prepare Text & Embed with Gemini 2 (3072 dims)
    const textToEmbed = `Topic: ${topic}\nCategory: ${category}\nContent: ${content}`;
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent(textToEmbed);
    const embedding = result.embedding.values;

    // 4. Ensure Qdrant collection exists (3072 dims)
    try {
      await qdrant.getCollection(collectionName);
    } catch {
      await qdrant.createCollection(collectionName, {
        vectors: { size: 3072, distance: "Cosine" },
      });
    }

    // 5. Upsert vector into Qdrant
    await qdrant.upsert(collectionName, {
      wait: true,
      points: [
        {
          id: _id,
          vector: embedding,
          payload: {
            topic,
            category,
            content,
            source: "sanity",
          },
        },
      ],
    });

    return NextResponse.json({ success: true, message: "Context embedded and stored in Qdrant." });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}