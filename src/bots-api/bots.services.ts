import { BotModel } from './bots.models';

// Create a bot (no UserBotMappingModel, no session)
export const createBot = async (data: any) => {
  return BotModel.create(data);
};

// Update a bot
export const updateBot = async (botId: string, data: any) => {
  return BotModel.findOneAndUpdate({ botId, organizationId: data.organizationId }, { $set: data }, { new: true });
};

// Delete a bot (no UserBotMappingModel, no session)
export const deleteBot = async (botId: string, organizationId: string) => {
  return BotModel.deleteOne({ botId, organizationId });
};

// List all bots for a user and organization
export const listBotsForUser = async (organizationId: string) => {
  return BotModel.find({ organizationId });
};

// List all bots by category for a user and organization
export const listBotsByCategory = async (organizationId: string) => {
  return BotModel.find({ organizationId });
};

// Get a bot by ID for a user and organization
export const getBotById = async (botId: string, organizationId: string) => {
  return BotModel.findOne({ botId, organizationId });
};
