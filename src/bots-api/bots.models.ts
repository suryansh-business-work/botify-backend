import { Schema, model, models, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Bot model (actual bot data)
const botSchema = new Schema({
  botId: { type: String, default: uuidv4, unique: true },
  organizationId: { type: String, required: true},
  name: { type: String, required: true },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  category: {
    value: { type: String, required: true },
    label: { type: String, required: true }
  },
}, { timestamps: true });

export const BotModel = models.Bot || model('Bot', botSchema);
