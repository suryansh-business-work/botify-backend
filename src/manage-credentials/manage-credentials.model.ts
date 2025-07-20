import { Schema, model, Document } from 'mongoose';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export interface IManageCredential extends Document {
  name: string;
  type: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ManageCredentialDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  value!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

const ManageCredentialSchema = new Schema<IManageCredential>({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String },
}, {
  timestamps: true,
});

export const ManageCredential = model<IManageCredential>('ManageCredential', ManageCredentialSchema);
