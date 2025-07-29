import express, { Request, Response } from "express";
import { getChatGptResponse } from "./chatgpt";
import { getBotPrompt } from "./chat-lab-apis/prompt/prompt.service";
import * as service from "../chat-api/chat-messages-api/message.service";
import { createUsage } from "./subscription-api/subscription-usage.service";
import { encode } from "gpt-tokenizer";

// Types
interface UserContext {
  userId: string;
  [key: string]: any;
}

interface ChatMessage {
  botId: string;
  role: "user" | "bot";
  content: string;
  userContext: UserContext;
}

interface SSEClients {
  [chatBotId: string]: Response[];
}

const router = express.Router();
const clients: SSEClients = {};

router.get("/events/:chatBotId", async (req: Request, res: Response) => {
  const chatBotId = req.params.chatBotId;
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  res.flushHeaders();

  // Add client to list
  if (!clients[chatBotId]) clients[chatBotId] = [];
  clients[chatBotId].push(res);

  // Send chat history on connect
  const rawHistory = await service.getMessages(chatBotId);
  const history: ChatMessage[] = rawHistory
    .filter((msg: any) => msg.role === "user" || msg.role === "bot")
    .map((msg: any) => ({
      botId: msg.botId,
      role: msg.role,
      content: msg.content,
      userContext: msg.userContext
    }));
  res.write(`event: history\ndata: ${JSON.stringify(history)}\n\n`);

  const keepAlive = setInterval(() => {
    res.write(":keep-alive\n\n");
  }, 25000);

  req.on("close", () => {
    clearInterval(keepAlive);
    clients[chatBotId] = clients[chatBotId].filter(r => r !== res);
    res.end();
  });
});

router.post("/send", async (req: Request, res: Response) => {
  const { chatBotId, userInput, userContext } = req.body as {
    chatBotId: string;
    userInput: string;
    userContext: UserContext;
  };

  // Save user message
  const userMsg: ChatMessage = {
    botId: chatBotId,
    role: "user",
    content: userInput,
    userContext: userContext
  };
  await service.createMessage(userMsg);

  await createUsage({
    botId: chatBotId,
    botOwnerUserId: userContext.userId,
    promptTokenSize: encode(userInput).length,
    prompt: userInput,
    userContext: userContext
  });

  const botResponseRaw: string = await getChatGptResponse(userInput);
  const botResObject: ChatMessage = {
    botId: chatBotId,
    role: "bot",
    content: botResponseRaw,
    userContext: userContext
  };
  console.log(botResponseRaw, 'botResponseRaw');
  await service.createMessage(botResObject);

  // Broadcast to all SSE clients for this bot
  if (clients[chatBotId]) {
    clients[chatBotId].forEach(clientRes => {
      clientRes.write(`data: ${JSON.stringify(botResObject)}\n\n`);
    });
  }

  res.json([botResObject]);
});

export default router;
