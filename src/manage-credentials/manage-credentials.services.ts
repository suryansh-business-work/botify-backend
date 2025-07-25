import { ManageCredential } from './manage-credentials.model';
import { ManageCredentialDTO, UpdateManageCredentialDTO } from './manage-credentials.validators';

// Create a credential
export const createCredentialService = async (dto: ManageCredentialDTO) => {
  return ManageCredential.create(dto);
};

// Get all credentials for an organization
export const getCredentialsService = async (organizationId: string) => {
  return ManageCredential.find({ organizationId });
};

// Get a credential by id and organization
export const getCredentialByIdService = async (credentialId: string, organizationId: string) => {
  return ManageCredential.findOne({ credentialId, organizationId });
};

// Update a credential by id and organization
export const updateCredentialService = async (
  credentialId: string,
  organizationId: string,
  update: Partial<UpdateManageCredentialDTO>
) => {
  return ManageCredential.findOneAndUpdate(
    { credentialId, organizationId },
    update,
    { new: true }
  );
};

// Delete a credential by id and organization
export const deleteCredentialService = async (credentialId: string, organizationId: string) => {
  return ManageCredential.findOneAndDelete({ credentialId, organizationId });
};
