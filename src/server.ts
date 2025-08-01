// Core & Third-party Imports
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import dayjs from 'dayjs';
import 'reflect-metadata';

// Swagger/OpenAPI
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// Database
import { connectDB } from '../db/db';

// Auth & User APIs
import authRoutes from './auth/auth.routes';

// Bot APIs
import childBotsRoutes from './bots-api/child-bots/childbot.routes';
import botsRoutes from './bots-api/bots.routes';
import childBotSettingRoutes from './chat-api/chat-settings-api/bot.settings.routes';
import childBotLabPromptRoutes from './chat-api/chat-lab-apis/prompt/prompt.routes';
// import { startWebSocketServer } from './chat-api/chat.ws';
import getChatGptResponseRoutes from './chat-api/chatgpt';
import chatSseRoutes from './chat-api/chat.sse'; // <-- Add this import

// MCP Servers APIs
import mcpServersRoutes from './mcp-servers/mcp-servers.routes';
import toolsRoutes from './mcp-servers/tools-api/tools-api.routs';
import toolCodeRoutes from './mcp-servers/tool-code/tool-code.routes';

// Upload & Subscription APIs
import imageKitUploadRoutes from './upload/upload.routes';
import subscriptionRoutes from './chat-api/subscription-api/subscription-usage.routes';

// Design System APIs
import { themeRoutes } from './design-system/theme/theme.routes';
import propertyRoutes from './design-system/property/property.routes';

// Code Run routes
import { dockerContainerRoutes } from './code-run/docker/routes/container.routes';
import isolateVmRoutes from './code-run/isolate-vm/isolate-vm.routes';

// Organization routes
import organizationRoutes from './organization-api/organization.routes';

// Manage Credentials routes
import manageCredentialsRouter from './manage-credentials/manage-credentials.routes';

const port = 4001;

// Express App Initialization
const app = express();

// =====================
// Swagger Documentation
// =====================
const swaggerDocument = YAML.load(
  path.join(__dirname, './design-system/design-system.swagger.yaml')
);
app.use('/api-docs/design-system', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ==========
// Middleware
// ==========
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://botify.life',
    'https://app.botify.life',
    'http://localhost:4322'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  fileUpload({
    limits: { fileSize: 999 * 1024 * 1024 }
  })
);

// Set CORS and Content-Type headers for JS files served from /static
app.use('/static', (req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});
// Serve static files from the "static" folder (for embed/chat widget, etc.)
app.use('/static', express.static(path.join(__dirname, '../static')));

// ===================
// API Route Handlers
// ===================

// Auth & User
app.use('/auth', authRoutes);

// Bot APIs
app.use('/bot', botsRoutes); // Main bot routes
app.use('/bot', childBotsRoutes);
app.use('/bot', childBotLabPromptRoutes);
app.use('/bot', childBotSettingRoutes);
app.use('/bot', authRoutes); // (If needed for bot-specific auth)
app.use('/chat-gpt', getChatGptResponseRoutes);

// Upload & Subscription
app.use('/v1/api', imageKitUploadRoutes);
app.use('/v1/api/subscription-usage', subscriptionRoutes);

// MCP Servers
app.use('/v1/api/mcp-server', mcpServersRoutes);
app.use('/v1/api/mcp-server/tool', toolsRoutes);
app.use('/v1/api/mcp-server/tool-code', toolCodeRoutes);

// Design System
app.use('/design-system', themeRoutes);
app.use('/design-system', propertyRoutes);

// Code Run routes
app.use('/v1/api/code-run', dockerContainerRoutes);
app.use('/v1/api', isolateVmRoutes);

// Organization routes
app.use('/v1/api/organization', organizationRoutes);

// Manage Credentials
app.use('/v1/api/manage-credentials', manageCredentialsRouter);

// Chat SSE API
app.use('/chat-sse', chatSseRoutes);

// ===============
// Utility Routes
// ===============
app.get('/healthcheck', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.status(200).send(`🚀 Server is running at http://localhost:${port}`);
});

app.get('/data-and-time', (_req, res) => {
  const formattedTime = dayjs().format('DD MMM YYYY hh:mm A');
  res.status(200).send(`Current time: ${formattedTime}`);
});

// ===================
// Start Server
// ===================
const startServer = async () => {
  await connectDB(); // Connect to MongoDB first

  app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
    // startWebSocketServer(); // Start WebSocket server only after DB is connected
  });
};

startServer();

export default app;
