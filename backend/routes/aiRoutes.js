import express from "express";
import { startChatSession, chatWithAI } from "../controllers/aiController.js";

const router = express.Router();

/**
 * @swagger
 * /api/ai/start:
 *   post:
 *     summary: Start a new chat session
 *     description: Creates a new session ID for a multi-turn conversation.
 *     responses:
 *       200:
 *         description: Returns the session ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "abc123-unique-session-id"
 */
router.post("/start", startChatSession);

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat with AI for code review
 *     description: Sends a code snippet or message for AI review and gets feedback.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "abc123-unique-session-id"
 *               userMessage:
 *                 type: string
 *                 example: "Review this code: console.log('Hello, World!');"
 *     responses:
 *       200:
 *         description: AI provides feedback on the given code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 aiResponse:
 *                   type: string
 *                   example: "Your code looks good but consider adding a semicolon for consistency."
 *                 session:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                       example: "abc123-unique-session-id"
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                             example: "user"
 *                           content:
 *                             type: string
 *                             example: "Review this code: console.log('Hello, World!');"
 */
router.post("/chat", chatWithAI);

export default router;
