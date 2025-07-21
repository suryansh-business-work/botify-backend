import { Request, Response } from 'express';
import { ManageCredential } from './manage-credentials.model';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'class-validator';
import { successResponse, successResponseArr, errorResponse, noContentResponse } from '../utils/response-object';
import { ManageCredentialDTO } from './manage-credentials.validators';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const createCredential = async (req: Request, res: Response) => {
  try {
    // Extract orgId from JWT (assume req.user is set by auth middleware)
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      return errorResponse(res, null, 'Organization ID not found in token');
    }
    const dto = Object.assign(new ManageCredentialDTO(), req.body);
    dto.credentialId = uuidv4();
    dto.organizationId = organizationId;
    const errors = await validate(dto);
    if (errors.length > 0) {
      return errorResponse(res, errors, 'Validation failed');
    }
    const credential = await ManageCredential.create({
      ...req.body,
      credentialId: dto.credentialId,
      organizationId: dto.organizationId,
    });
    return successResponse(res, credential, 'Credential created successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to create credential');
  }
};

export const getCredentials = async (req: Request, res: Response) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      return errorResponse(res, null, 'Organization ID not found in token');
    }
    const credentials = await ManageCredential.find({ organizationId });
    if (!credentials || credentials.length === 0) {
      return noContentResponse(res, [], 'No credentials found');
    }
    return successResponseArr(res, credentials, {}, 'Credentials fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to fetch credentials');
  }
};

export const getCredentialById = async (req: Request, res: Response) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      return errorResponse(res, null, 'Organization ID not found in token');
    }
    const credential = await ManageCredential.findOne({ credentialId: req.params.id, organizationId });
    if (!credential) {
      return noContentResponse(res, null, 'Credential not found');
    }
    return successResponse(res, credential, 'Credential fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to fetch credential');
  }
};

export const updateCredential = async (req: Request, res: Response) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      return errorResponse(res, null, 'Organization ID not found in token');
    }
    const dto = Object.assign(new ManageCredentialDTO(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return errorResponse(res, errors, 'Validation failed');
    }
    const credential = await ManageCredential.findOneAndUpdate(
      { credentialId: req.params.id, organizationId },
      req.body,
      { new: true }
    );
    if (!credential) {
      return noContentResponse(res, null, 'Credential not found');
    }
    return successResponse(res, credential, 'Credential updated successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to update credential');
  }
};

export const deleteCredential = async (req: Request, res: Response) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      return errorResponse(res, null, 'Organization ID not found in token');
    }
    const credential = await ManageCredential.findOneAndDelete({ credentialId: req.params.id, organizationId });
    if (!credential) {
      return noContentResponse(res, null, 'Credential not found');
    }
    return successResponse(res, credential, 'Credential deleted successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to delete credential');
  }
};
