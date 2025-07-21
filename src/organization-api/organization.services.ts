import { OrganizationModel } from './organization.models';
import { CreateOrganizationDTO, UpdateOrganizationDTO } from './organization.validators';

// Create a new organization
export const createOrganization = async (dto: CreateOrganizationDTO) => {
  return OrganizationModel.create(dto);
};

// Get organization by ID
export const getOrganizationById = async (organizationId: string) => {
  return OrganizationModel.findOne({ organizationId });
};

// Update organization
export const updateOrganization = async (organizationId: string, dto: UpdateOrganizationDTO) => {
  return OrganizationModel.findOneAndUpdate(
    { organizationId },
    { $set: dto },
    { new: true }
  );
};

// Delete organization
export const deleteOrganization = async (organizationId: string) => {
  return OrganizationModel.findOneAndDelete({ organizationId });
};

// Regenerate API key
export const regenerateApiKey = async (organizationId: string) => {
  const { v4: uuidv4 } = require('uuid');
  return OrganizationModel.findOneAndUpdate(
    { organizationId },
    { $set: { organizationApiKey: uuidv4() } },
    { new: true }
  );
};

// Get all public organizations
export const getPublicOrganizations = async () => {
  return OrganizationModel.find({ isOrganizationPublic: true, isOrganizationDisabled: false });
};