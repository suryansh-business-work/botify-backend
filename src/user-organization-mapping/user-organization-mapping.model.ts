import mongoose, { Schema, Document, model } from 'mongoose';

export interface IUserOrganizationMapping extends Document {
  userId: string;
  organizationId: string;
  selected: boolean; // Added field
  createdAt: Date;
  updatedAt: Date;
}

const UserOrganizationMappingSchema = new Schema<IUserOrganizationMapping>({
  userId: { type: String, required: true, index: true },
  organizationId: { type: String, required: true, index: true },
  selected: { type: Boolean, default: false }, // Added field
}, {
  timestamps: true,
});

export const UserOrganizationMappingModel = model<IUserOrganizationMapping>('UserOrganizationMapping', UserOrganizationMappingSchema);
