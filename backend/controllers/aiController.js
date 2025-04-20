import ChatSession from "../models/ChatSession.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const AIML_API_KEY = process.env.AIML_API_KEY;
const AIML_API_URL = "https://api.aimlapi.com/v1/chat/completions";
const AIML_MODEL = process.env.AIML_MODEL || "mistralai/Mistral-7B-Instruct-v0.2";

if (!AIML_API_KEY) {
  console.error("Critical Error: Missing AIML_API_KEY. Terminating.");
  process.exit(1);
}

/**
 * Creates a new chat session without authentication.
 */
export const startChatSession = async (req, res) => {
  try {
    const sessionId = uuidv4();
    const newSession = new ChatSession({ sessionId, messages: [] });
    await newSession.save();
    console.log(`New chat session started: ${sessionId}`);
    res.status(201).json({ sessionId });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal Server Error: Failed to initialize chat session." });
  }
};

/**
 * Processes user messages and responds with AI-powered debugging suggestions.
 */
export const chatWithAI = async (req, res) => {
  const { sessionId, userMessage } = req.body;
  if (!sessionId || !userMessage) {
    return res.status(400).json({ error: "Bad Request: Session ID and user message are required." });
  }

  try {
    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: "Not Found: Chat session does not exist." });
    }

    session.messages.push({ role: "user", content: userMessage });
    await session.save();

    const formattedMessages = session.messages.slice(-15).map(({ role, content }) => ({ role, content }));

    // AI receives a specialized instruction to focus on debugging and fixing code issues
    const debugPrompt = {
      role: "system",
      content:
        "You are an advanced AI specializing in software debugging. Analyze errors, suggest fixes, and provide improved code snippets when necessary."
    };

    const apiRequest = async (attempt = 1) => {
      try {
        const response = await fetch(AIML_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${AIML_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: AIML_MODEL,
            messages: [debugPrompt, ...formattedMessages],
            temperature: 0.3,
            max_tokens: 1024,
            top_p: 0.8,
            frequency_penalty: 0.5,
            presence_penalty: 0.1,
          }),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`API Request Failed (Attempt ${attempt}):`, error);
        if (attempt < 3) {
          return await apiRequest(attempt + 1);
        }
        throw error;
      }
    };

    const completion = await apiRequest();
    const aiMessage = completion.choices?.[0]?.message?.content || "AI did not generate a response.";

    session.messages.push({ role: "assistant", content: aiMessage });
    await session.save();

    res.json({ aiResponse: aiMessage, session });
  } catch (error) {
    console.error("Critical error during AI processing:", error);
    res.status(500).json({ error: "Internal Server Error: AI processing encountered an unexpected error.", details: error.message });
  }
};
