import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ManageCredentialDTO {
  @IsString()
  credentialId?: string;

  @IsString()
  organizationId?: string;

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

export class UpdateManageCredentialDTO {
  @IsOptional()
  @IsString()
  credentialId?: string;

  @IsString()
  organizationId?: string;

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