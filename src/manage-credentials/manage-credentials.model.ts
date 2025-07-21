import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IManageCredential extends Document {
  credentialId: string;
  organizationId: string;
  name: string;
  type: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ManageCredentialSchema = new Schema<IManageCredential>({
  credentialId: { type: String, required: true, unique: true, default: uuidv4 },
  organizationId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String },
}, {
  timestamps: true,
});

export const ManageCredential = model<IManageCredential>('ManageCredential', ManageCredentialSchema);
